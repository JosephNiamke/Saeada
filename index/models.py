from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')

    class Meta:
        verbose_name = "Sous-catégorie"
        verbose_name_plural = "Sous-catégories"

    def __str__(self):
        return f"{self.name} ({self.category.name})"


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    subcategory = models.ForeignKey(
        'SubCategory',
        on_delete=models.CASCADE,
        related_name='brands'
    )

    class Meta:
        verbose_name = "Marque"
        verbose_name_plural = "Marques"

    def __str__(self):
        return f"{self.name} ({self.subcategory.name})"


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)

    image = models.ImageField(upload_to='produits/')
    featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

from django.shortcuts import render
from .models import Product  # ou depuis l'app 'produits'

def cart_view(request):
    # Exemple si le panier est dans la session
    cart = request.session.get('cart', {})  # cart = {'product_id': quantity}

    products = []
    total = 0
    for product_id, quantity in cart.items():
        try:
            product = Product.objects.get(id=product_id)
            product.total_price = product.price * quantity
            product.quantity = quantity
            products.append(product)
            total += product.total_price
        except Product.DoesNotExist:
            continue

    return render(request, 'cart.html', {'cart_items': products, 'cart_total': total})

