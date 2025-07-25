from django.shortcuts import render, get_object_or_404
from .models import Product, Category, SubCategory, Brand

def index(request):
    featured_products = Product.objects.filter(featured=True)[:4] # Get first 4 featured products
    categories = Category.objects.all()
    context = {
        'featured_products': featured_products,
        'categories': categories,
    }
    return render(request, 'index.html', context)

def products_list(request):
    category_name = request.GET.get('category', 'all')
    subcategory_name = request.GET.get('subcategory', 'all')
    brand_name = request.GET.get('brand', 'all')

    products = Product.objects.all()
    categories = Category.objects.all()
    subcategories = SubCategory.objects.all()
    brands = Brand.objects.all()

    current_category = category_name
    current_subcategory = subcategory_name
    current_brand = brand_name

    # Filtrer par catégorie
    if category_name != 'all':
        category = get_object_or_404(Category, name__iexact=category_name)
        products = products.filter(category=category)

        # Filtrer par sous-catégorie
        if subcategory_name != 'all':
            subcategory = get_object_or_404(SubCategory, name__iexact=subcategory_name, category=category)
            products = products.filter(subcategory=subcategory)

    # Filtrer par marque
    if brand_name != 'all':
        brand = get_object_or_404(Brand, name__iexact=brand_name)
        products = products.filter(brand=brand)

    # Préparer les marques disponibles par catégorie pour le filtre dynamique
    brands_for_filter = {}
    for cat in categories:
        cat_brands = Brand.objects.filter(product__category=cat).distinct()
        brands_for_filter[cat.name.lower()] = list(cat_brands.values_list('name', flat=True))

    context = {
        'products': products,
        'categories': categories,
        'subcategories': subcategories,
        'brands': brands,
        'current_category': current_category,
        'current_subcategory': current_subcategory,
        'current_brand': current_brand,
        'brands_for_filter': brands_for_filter,
    }
    return render(request, 'produits.html', context)


def product_detail(request, product_id):
    product = get_object_or_404(Product, pk=product_id)
    related_products = Product.objects.filter(category=product.category).exclude(pk=product_id)[:3]
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'produit-detail.html', context)

def about(request):
    return render(request, 'a-propos.html')

def contact(request):
    return render(request, 'contact.html')

def cart_view(request):
    return render(request, 'panier.html')
