from django.contrib import admin
from .models import Category, SubCategory, Brand, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'subcategory')
    search_fields = ('name',)
    list_filter = ('subcategory',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'subcategory', 'brand', 'price', 'featured', 'created_at')
    list_filter = ('category', 'subcategory', 'brand', 'featured')
    search_fields = ('name', 'description')
    ordering = ('name',)
