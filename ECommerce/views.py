from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.views.decorators.csrf import csrf_protect
from .models import Product, Order, OrderItem, Cart, CartItem
from .forms import CustomUserCreationForm, ProductForm
from django.http import HttpResponseForbidden
from django.utils import timezone
from django.db import transaction

def home(request):
    cart_items = []

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_items = CartItem.objects.filter(cart=cart).select_related('product')

    return render(request, 'home.html', {'cart_items': cart_items})

def shop_view(request):
    products = Product.objects.all()
    cart_items = []

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_items = CartItem.objects.filter(cart=cart).select_related('product')

    return render(request, 'shop.html', {
        'products': products,
        'cart_items': cart_items,
    })

def product_search(request):
    query = request.GET.get('q')
    products = Product.objects.filter(name__icontains=query) if query else []
    return render(request, 'search_results.html', {'products': products, 'query': query})

@login_required
def add_to_cart(request):
    if request.method == 'POST':
        product_id = request.POST.get('product_id')
        quantity = int(request.POST.get('quantity'))

        product = get_object_or_404(Product, pk=product_id)

        if product.stock < quantity:
            return redirect('shop')

        cart, _ = Cart.objects.get_or_create(user=request.user)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        cart_item.quantity += quantity
        cart_item.save()

        return redirect('shop')

    return redirect('shop')

@login_required
def remove_from_cart(request, item_id):
    cart = get_object_or_404(Cart, user=request.user)
    item = get_object_or_404(CartItem, id=item_id, cart=cart)
    item.delete()
    referer = request.META.get('HTTP_REFERER')  # the previous page
    if referer:
        return redirect(referer)
    return redirect('shop')  # fallback if no referer

@login_required
@transaction.atomic
def checkout_view(request):
    cart = get_object_or_404(Cart, user=request.user)
    cart_items_qs = CartItem.objects.filter(cart=cart).select_related('product')

    line_items = []
    total = 0
    has_oos = False

    for ci in cart_items_qs:
        product = ci.product
        subtotal = ci.quantity * product.price
        total += subtotal

        if product.stock == 0:
            has_oos = True

        line_items.append({
            'item_id':  ci.id,
            'product':  product,
            'quantity': ci.quantity,
            'subtotal': subtotal,
        })

    if request.method == 'POST':
        if has_oos:
            return redirect('checkout')

        order = Order.objects.create(user=request.user)

        for ci in cart_items_qs:
            product = ci.product

            # Double-check for stock before processing
            if ci.quantity > product.stock:
                messages.error(request, f"Not enough stock for {product.name}.")
                return redirect('checkout')

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                product_description=product.description,
                product_price=product.price,
                quantity=ci.quantity
            )

            # Deduct stock
            product.stock -= ci.quantity
            product.save()

        cart_items_qs.delete()
        return redirect('orders')

    return render(request, 'checkout.html', {
        'line_items': line_items,
        'total':      total,
        'has_oos':    has_oos,
    })

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('account')
    else:
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.user.is_authenticated:
        cart_items = []
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_items = CartItem.objects.filter(cart=cart).select_related('product')
        return render(request, 'account.html', {'cart_items': cart_items})

    form = AuthenticationForm(request, data=request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            auth_login(request, form.get_user())
            return redirect('account')
        else:
            messages.error(request, "Invalid username or password.")

    return render(request, 'account.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('account')

@login_required
def selling_screen(request):
    if request.user.id != 1:
        return redirect('account')

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)  # include request.FILES for image uploads
        if form.is_valid():
            form.save()

            if '_addanother' in request.POST:
                messages.success(request, "Product saved. Add another.")
                return redirect('selling_screen')
    else:
        form = ProductForm()

    return render(request, 'selling_screen.html', {'form': form})

@login_required
def edit_product(request, product_id):
    if request.user.id != 1:
        return redirect('shop')  # only allow user ID 1 to access

    product = get_object_or_404(Product, ID=product_id)

    if request.method == 'POST':
        if 'delete' in request.POST:
            product.delete()
            return redirect('shop')

        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('edit_product', product_id=product_id)
    else:
        form = ProductForm(instance=product)

    return render(request, 'edit_product.html', {'form': form, 'product': product})

@login_required
def orders(request):
    cart_items = []
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user).first()
        if cart:
            cart_items = CartItem.objects.filter(cart=cart).select_related('product')

    if request.user.id == 1:
        orders_qs = Order.objects.all().prefetch_related('items__product').select_related('user')
    else:
        orders_qs = Order.objects.filter(user=request.user).prefetch_related('items__product')

    order_data = []
    for order in orders_qs:
        items = order.items.all()
        delivered = order.delivery_date is not None and order.delivery_date <= timezone.now()
        order_data.append({
            'id': order.id,
            'date_ordered': order.date_ordered,
            'delivery_date': order.delivery_date,
            'delivered': delivered,
            'items': items
        })

    return render(request, 'orders.html', {
        'cart_items': cart_items,
        'orders': order_data,
        'now': timezone.now(),
    })
