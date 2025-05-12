import random
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

def random_delivery_time():
    minutes = random.randint(5, 30)
    return timezone.now() + timedelta(minutes=minutes)

class Product(models.Model):
    ID = models.AutoField(primary_key=True)  # match your SQL schema
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'ECommerce_product' 

class Order(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE)
    date_ordered   = models.DateTimeField(auto_now_add=True)
    delivery_date  = models.DateTimeField(default=random_delivery_time)

    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

    @property
    def delivered(self):
        return timezone.now() >= self.delivery_date

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, to_field='ID', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Cart {self.pk} for {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE) 
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.quantity} of {self.product.name} in Cart {self.cart_id}"
    