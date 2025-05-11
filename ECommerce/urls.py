from django.contrib import admin
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('', views.home, name='home'),
    path('shop/', views.shop_view, name='shop'),
    path('shop/search/', views.product_search, name='product_search'),
    path('account/', views.login_view, name='account'),
    path('orders/', views.orders, name='orders'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('sell/', views.selling_screen, name='selling_screen'),
    path('edit/<int:product_id>/', views.edit_product, name='edit_product'),
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)