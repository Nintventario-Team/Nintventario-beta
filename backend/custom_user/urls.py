from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *


urlpatterns = [
    path('products/', get_all_products, name='get_all_products'),
    path('filteredProducts/', get_filtered_products, name='get-filtered-products'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('newest-products/', newest_products, name='newest-products'),
    path('bestselling-products/', bestselling_products, name='bestselling-products'),
]