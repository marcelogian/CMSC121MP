from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def shop(request):
    return render(request, 'shop.html')

def cart(request):
    return render(request, 'cart.html')

def account(request):
    return render(request, 'account.html')

def orders(request):
    return render(request, 'orders.html')