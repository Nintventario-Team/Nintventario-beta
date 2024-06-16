from itertools import count
from django.urls import get_resolver
from rest_framework import viewsets
from .models import User, Client, Category, Product, Order, OrderItem
from .serializers import UserSerializer, ClientSerializer, CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
import json
from django.db.models import Count

def get_all_products(request):
    products = Product.objects.all()
    products_list = list(products.values())
    return JsonResponse(products_list, safe=False)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            password2 = data.get('password2')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if password != password2:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        try:
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            user.save()
            return JsonResponse({'message': 'Registration successful'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
#INDEX METHOD PAGE

def newest_products(request):
    newest_products = Product.objects.order_by('-date_added')[:4]
    serialized_products = [{'id':product.pk,'name': product.name, 'description': product.description, 'price': product.price,'quantity':product.quantity, 'image': product.image} for product in newest_products]
    return JsonResponse(serialized_products, safe=False)

def bestselling_products(request):
    bestselling_products = Product.objects.annotate(total_quantity=Count('order_items__quantity')).order_by('-total_quantity')[:4]
    serialized_products = [{'id':product.pk,'name': product.name, 'description': product.description, 'price': product.price,'quantity':product.quantity, 'image': product.image} for product in bestselling_products]
    return JsonResponse(serialized_products, safe=False)