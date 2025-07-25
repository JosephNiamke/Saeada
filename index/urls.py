from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('produits.html', views.products_list, name='products_list'),
    path('produit-detail-<int:product_id>.html', views.product_detail, name='product_detail'),  # ✅ corrigé ici
    path('a-propos.html', views.about, name='about'),
    path('contact.html', views.contact, name='contact'),
    path('panier.html', views.cart_view, name='cart_view'),
]
