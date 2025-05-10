from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('', views.home, name='home'),
    path('shop/', views.shop_view, name='shop'),
    path('shop/search/', views.product_search, name='product_search'),
    path('account/', views.login_view, name='account'),
    path('orders/', views.orders, name='orders'),
    path('signup/', views.signup, name='signup'),
]