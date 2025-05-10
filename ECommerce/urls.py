from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('shop/', views.shop, name='shop'),
    path('account/', views.account, name='account'),
    path('orders/', views.orders, name='orders'),
    path('signup/', views.signup, name='signup'),
]