from django.urls import path
from .views import (
    add_to_wishlist,
    create_order,
    get_all_products,
    get_filtered_products,
    get_wishlist,
    login_view,
    register_view,
    newest_products,
    bestselling_products,
    get_user_data,
    logout_view,
    remove_from_wishlist,
)

urlpatterns = [
    path('products/', get_all_products, name='get_all_products'),
    path('filteredProducts/', get_filtered_products, name='get-filtered-products'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('newest-products/', newest_products, name='newest-products'),
    path('bestselling-products/', bestselling_products, name='bestselling-products'),
    path('get-user-data/', get_user_data, name='get-user-data'),
    path('create-order/', create_order, name='create_order'),
    path('logout/', logout_view, name='logout_view'),
    path('wishlist/add/', add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/', get_wishlist, name='get_wishlist'),
    path('wishlist/remove/', remove_from_wishlist, name='remove_from_wishlist'),
]
