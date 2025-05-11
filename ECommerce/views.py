from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from .models import Product, Order, OrderItem, Cart, CartItem
from .forms import CustomUserCreationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from .forms import ProductForm
from django.http import HttpResponseForbidden


def home(request):
    context = {}
    return render(request, 'home.html', context)

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

@csrf_protect
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    return render(request, 'account.html')

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
    return redirect('shop')

@login_required
def checkout_view(request):
    cart = get_object_or_404(Cart, user=request.user)
    if request.method == 'POST':
        order = Order.objects.create(user=request.user)
        for item in cart.cartitem_set.all():
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)
        cart.cartitem_set.all().delete()
        return redirect('orders')
    return render(request, 'checkout.html', {'cart': cart})

def orders(request):
    return render(request, 'orders.html')

def signup(request):
    return render(request, 'signup.html')

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('account')  # or wherever you want to redirect
    else:
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form': form})

def login_view(request):
    from django.contrib.auth.forms import AuthenticationForm
    from django.contrib.auth import login
    from django.contrib import messages

    if request.user.is_authenticated:
        return render(request, 'account.html')  # already logged in

    form = AuthenticationForm(request, data=request.POST or None)

    if request.method == 'POST':
        if form.is_valid():
            login(request, form.get_user())
            return redirect('account')  # back to account page to now see logout
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
