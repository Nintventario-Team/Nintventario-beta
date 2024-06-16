from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import *


urlpatterns = [
    path('products/', get_all_products, name='get_all_products'),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('debug-urls/', debug_urls),
]