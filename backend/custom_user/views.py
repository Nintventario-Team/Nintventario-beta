from django.contrib.auth import authenticate, login, logout
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.decorators import api_view, permission_classes, authentication_classes  # noqa: E501
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication # type: ignore

import json


from .models import Product, User
from .serializers import ProductSerializer

# PRODUCT METHODS


def get_all_products(request):
    products = Product.objects.all()
    products_list = list(products.values())
    return JsonResponse(products_list, safe=False)


def get_filtered_products(request):
    price_min = request.GET.get('price_min', None)
    price_max = request.GET.get('price_max', None)
    product_type = request.GET.get('product_type', None)

    filters = {}
    if price_min is not None:
        filters['price__gte'] = price_min
    if price_max is not None:
        filters['price__lte'] = price_max
    if product_type is not None:
        filters['category__name__icontains'] = product_type

    products = Product.objects.filter(**filters)
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)

# AUTH METHODS


@ensure_csrf_cookie
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
            refresh = RefreshToken.for_user(user)
            login(request, user)
            return JsonResponse({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token)})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            email = data.get('email')
            password = data.get('password')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

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
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'Registration successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token)})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

# INDEX METHOD PAGE


def newest_products(request):
    newest_products = Product.objects.order_by('-date_added')[:4]
    serialized_products = [
        {
            'id': product.pk,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'quantity': product.quantity,
            'image': product.image
        } for product in newest_products
    ]
    return JsonResponse(serialized_products, safe=False)


def bestselling_products(request):
    bestselling_products = Product.objects.annotate(
        total_quantity=Count('order_items__quantity')
    ).order_by('-total_quantity')[:4]
    serialized_products = [
        {
            'id': product.pk,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'quantity': product.quantity,
            'image': product.image
        } for product in bestselling_products
    ]
    return JsonResponse(serialized_products, safe=False)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user_data = {
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    }
    return JsonResponse(user_data)
