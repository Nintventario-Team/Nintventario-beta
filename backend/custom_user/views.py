from django.contrib.auth import authenticate, login, logout
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.decorators import api_view, permission_classes, authentication_classes  # noqa: E501
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication # type: ignore
from django.core.mail import send_mail
from django.http import JsonResponse

import json


from .models import Order, Product, User, WishlistItem,Client
from .serializers import OrderSerializer, ProductSerializer
from custom_user import serializers

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

# EMAIL METHOD
@csrf_exempt
def send_contact_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cedula = data.get('cedula')
        nombres = data.get('nombres')
        telefono = data.get('telefono')
        email = data.get('email')
        ciudad = data.get('ciudad')
        asunto = data.get('asunto')
        comentario = data.get('comentario')

        send_mail(
            f'Contacto desde la web: {asunto}',
            f'Cédula: {cedula}\nNombre: {nombres}\nTeléfono: {telefono}\nEmail: {email}\nCiudad: {ciudad}\nComentario: {comentario}',
            'nintventario@gmail.com',  # De
            ['jorgemawyincabay@gmail.com'],  # Para
            fail_silently=False,
        )

        return JsonResponse({'message': 'Correo enviado exitosamente'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@csrf_exempt
def send_register_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        asunto = '¡Bienvenido a Mundo Mágico del Nintendo!'
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        send_mail(
            f'{asunto}',
            f'''
            Hola {first_name} {last_name},

            ¡Gracias por registrarte en Mundo Mágico del Nintendo! Estamos encantados de tenerte con nosotros.

            Si necesitas ayuda o tienes algún comentario, puedes encontrarnos fácilmente en nuestra página de contacto:
            [https://nintventario.web.app/contacto]. 
            Ahí encontrarás todos los métodos disponibles para comunicarte con nosotros. 

            Estamos aquí para ayudarte y responder cualquier pregunta que puedas tener. 

            ¡Gracias por ser parte de nuestra comunidad!

            Atentamente,
            Mundo Mágico del Nintendo
            ''',
            'nintventario@gmail.com',  # De
            [email],  # Para
            fail_silently=False,
        )

        return JsonResponse({'message': 'Correo enviado exitosamente'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

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
            refresh = RefreshToken.for_user(user)

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
            # Create a Client instance with optional data
            Client.objects.create(
                user=user,
            )
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
        'id': request.user.id,
        'email': request.user.email,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
    }
    print(user_data)
    return JsonResponse(user_data)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        
        try:
            client = Client.objects.get(user=request.user)
            data['client'] = client.id  
        except Client.DoesNotExist:
            return JsonResponse({'error': 'Client not found'}, status=404)
        
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            try:
                order = serializer.save()
                return JsonResponse(serializer.data, status=201)
            except serializers.ValidationError as e:
                return JsonResponse({'error': str(e)}, status=400)
        else:
            return JsonResponse(serializer.errors, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    user = request.user
    try:
        data = json.loads(request.body.decode('utf-8'))
        product_id = data.get('product_id')
        product = Product.objects.get(id=product_id)
        wishlist_item, created = WishlistItem.objects.get_or_create(user=user, product=product)
        if created:
            return JsonResponse({'message': 'Product added to wishlist'}, status=201)
        else:
            return JsonResponse({'message': 'Product already in wishlist'}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    user = request.user
    wishlist_items = WishlistItem.objects.filter(user=user).select_related('product')
    serialized_wishlist = [
        {
            'id': item.product.id,
            'name': item.product.name,
            'description': item.product.description,
            'price': item.product.price,
            'image': item.product.image,
            'added_at': item.added_at,
        }
        for item in wishlist_items
    ]
    return JsonResponse(serialized_wishlist, safe=False)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request):
    user = request.user
    try:
        data = json.loads(request.body.decode('utf-8'))
        product_id = data.get('product_id')
        product = Product.objects.get(id=product_id)
        WishlistItem.objects.filter(user=user, product=product).delete()
        return JsonResponse({'message': 'Product removed from wishlist'}, status=200)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product does not exist'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_purchase_history(request):
    # Assuming `request.user` is an instance of the User model
    # Get the Client instance associated with the user
    try:
        client = Client.objects.get(user=request.user)
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client not found'}, status=404)
    
    # Fetch orders for the found client
    orders = Order.objects.filter(client=client).order_by('-date_created')
    serializer = OrderSerializer(orders, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_product_by_id(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return JsonResponse(serializer.data, safe=False)
    except Product.DoesNotExist:
        return JsonResponse({'error': 'Product not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)