from django.urls import path
from .views import (create_order_view,capture_order_view)

urlpatterns = [
    path('create-order/', create_order_view, name='create-order'),
    path('capture-order/<str:order_id>/', capture_order_view, name='capture-order'),

]
