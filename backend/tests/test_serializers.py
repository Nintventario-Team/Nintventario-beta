from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory
from custom_user.models import User, Client, Category, Product, Order, OrderItem, WishlistItem
from custom_user.serializers import (
    UserSerializer, ClientSerializer, CategorySerializer, ProductSerializer, 
    OrderSerializer, OrderItemSerializer, WishlistItemSerializer
)
from .factories import UserFactory, ClientFactory, CategoryFactory, ProductFactory, OrderFactory, OrderItemFactory, WishlistItemFactory

class UserSerializerTest(TestCase):

    def test_user_serializer(self):
        user = UserFactory()
        serializer = UserSerializer(user)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'email', 'first_name', 'last_name', 'password', 
        'last_login', 'is_active', 'date_joined', 'is_staff', 'groups', 'is_superuser', 'user_permissions']))

    def test_user_update(self):
        user = UserFactory()
        serializer = UserSerializer(user, data={'first_name': 'Updated Name'}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.first_name, 'Updated Name')

    def test_user_invalid_email(self):
        user = UserFactory()
        serializer = UserSerializer(user, data={'email': 'invalidemail'}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

class ClientSerializerTest(TestCase):

    def test_client_serializer(self):
        client = ClientFactory()
        serializer = ClientSerializer(client)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'dni', 'user', 'direction', 'cellphone', 'city']))

    def test_client_update(self):
        client = ClientFactory()
        serializer = ClientSerializer(client, data={'city': 'New City'}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_client = serializer.save()
        self.assertEqual(updated_client.city, 'New City')


class CategorySerializerTest(TestCase):

    def test_category_serializer(self):
        category = CategoryFactory()
        serializer = CategorySerializer(category)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'description']))

    def test_category_update(self):
        category = CategoryFactory()
        serializer = CategorySerializer(category, data={'description': 'Updated description'}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_category = serializer.save()
        self.assertEqual(updated_category.description, 'Updated description')

    def test_category_invalid_name(self):
        CategoryFactory(name='UniqueName')
        category = CategoryFactory()
        serializer = CategorySerializer(category, data={'name': 'UniqueName'}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)

class ProductSerializerTest(TestCase):

    def test_product_serializer(self):
        product = ProductFactory()
        serializer = ProductSerializer(product)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'name', 'description', 'price', 'quantity', 'category', 'date_added', 'local', 'image', 'details']))

    def test_product_update(self):
        product = ProductFactory()
        serializer = ProductSerializer(product, data={'price': '200.00'}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_product = serializer.save()
        self.assertEqual(updated_product.price, 200.00)

    def test_product_invalid_price(self):
        product = ProductFactory()
        serializer = ProductSerializer(product, data={'price': 'invalid_price'}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('price', serializer.errors)

class OrderItemSerializerTest(TestCase):

    def test_orderitem_serializer(self):
        order_item = OrderItemFactory()
        serializer = OrderItemSerializer(order_item)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['product', 'quantity']))

    def test_orderitem_update(self):
        order_item = OrderItemFactory(quantity=2)
        serializer = OrderItemSerializer(order_item, data={'quantity': 3}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_order_item = serializer.save()
        self.assertEqual(updated_order_item.quantity, 3)

    def test_orderitem_invalid_quantity(self):
        order_item = OrderItemFactory()
        serializer = OrderItemSerializer(order_item, data={'quantity': -1}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertIn('quantity', serializer.errors)

class OrderSerializerTest(TestCase):

    def test_order_serializer(self):
        order = OrderFactory()
        order_item = OrderItemFactory(order=order)
        serializer = OrderSerializer(order)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'client', 'total', 'status', 'date_created', 'date_update', 'items']))
        self.assertEqual(len(data['items']), 1)
        self.assertEqual(data['items'][0]['product'], order_item.product.id)
        self.assertEqual(data['items'][0]['quantity'], order_item.quantity)

    def test_order_create(self):
        client = ClientFactory()
        product = ProductFactory(quantity=10)
        data = {
            'client': client.id,
            'total': '100.00',
            'status': 2,
            'items': [
                {
                    'product': product.id,
                    'quantity': 2,
                }
            ]
        }
        factory = APIRequestFactory()
        request = factory.post('/orders/', data, format='json')
        serializer = OrderSerializer(data=data, context={'request': request})
        
        if not serializer.is_valid():
            print(serializer.errors)
        
        self.assertTrue(serializer.is_valid())
        order = serializer.save()
        self.assertEqual(order.items.first().product, product)
        self.assertEqual(order.items.first().quantity, 2)
        self.assertEqual(Product.objects.get(id=product.id).quantity, 8)



    def test_order_create_insufficient_quantity(self):
        client = ClientFactory()
        product = ProductFactory(quantity=1)  
        data = {
            'client': client.id,
            'total': '100.00',
            'status': 3,
            'items': [
                {
                    'product': product.id,
                    'quantity': 2,  
                }
            ]
        }

        factory = APIRequestFactory()
        request = factory.post('/orders/', data, format='json')
        
        serializer = OrderSerializer(data=data, context={'request': request})
        serializer.is_valid()
        with self.assertRaises(ValidationError):
            serializer.save()

    
    
class WishlistItemSerializerTest(TestCase):

    def test_wishlistitem_serializer(self):
        wishlist_item = WishlistItemFactory()
        serializer = WishlistItemSerializer(wishlist_item)
        data = serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'user', 'product', 'added_at']))

    def test_wishlistitem_update(self):
        wishlist_item = WishlistItemFactory()
        product = ProductFactory()
        serializer = WishlistItemSerializer(wishlist_item, data={'product': product.id}, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_wishlist_item = serializer.save()
        self.assertEqual(updated_wishlist_item.product, product)

    def test_wishlistitem_invalid_unique(self):
        wishlist_item = WishlistItemFactory()
        serializer = WishlistItemSerializer(data={'user': wishlist_item.user.id, 'product': wishlist_item.product.id})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
