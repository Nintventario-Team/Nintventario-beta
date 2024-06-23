from django.test import TestCase
from custom_user.models import User, Client, Category, Product, Order, OrderItem
from custom_user.serializers import UserSerializer, ClientSerializer, CategorySerializer, ProductSerializer, OrderSerializer, OrderItemSerializer
from .factories import UserFactory, ClientFactory, CategoryFactory, ProductFactory, OrderFactory, OrderItemFactory

class UserSerializerTestCase(TestCase):
    def setUp(self):
        self.user = UserFactory.build() 

    def test_user_serializer_valid(self):
        serializer = UserSerializer(data=self.user.__dict__)
        self.assertTrue(serializer.is_valid())

    def test_user_serializer_required_fields(self):
        serializer = UserSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertIn('password', serializer.errors)


class ClientSerializerTestCase(TestCase):
    def setUp(self):
        self.client = ClientFactory.build()
        self.user = UserFactory.create()
        

    def test_client_serializer_valid(self):
        client_data = self.client.__dict__.copy()
        client_data['user'] = self.user.id

        serializer = ClientSerializer(data=client_data)
        
        self.assertTrue(serializer.is_valid(raise_exception=True))

    def test_client_serializer_required_fields(self):
        serializer = ClientSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('dni', serializer.errors)
        self.assertIn('direction', serializer.errors)
        self.assertIn('cellphone', serializer.errors)
        self.assertIn('city', serializer.errors)


class CategorySerializerTestCase(TestCase):
    def setUp(self):
        self.category = CategoryFactory.build()  

    def test_category_serializer_valid(self):
        serializer = CategorySerializer(data=self.category.__dict__)
        self.assertTrue(serializer.is_valid())

    def test_category_serializer_required_fields(self):
        serializer = CategorySerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertIn('description', serializer.errors)


class ProductSerializerTestCase(TestCase):
    def setUp(self):
        self.product = ProductFactory.build()  

    def test_product_serializer_valid(self):
        self.product.date_added = self.product.date_added.date()

        serializer = ProductSerializer(data=self.product.__dict__)
        self.assertTrue(serializer.is_valid(raise_exception=True))

    def test_product_serializer_required_fields(self):
        serializer = ProductSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)
        self.assertIn('description', serializer.errors)
        self.assertIn('price', serializer.errors)
        self.assertIn('quantity', serializer.errors)


class OrderSerializerTestCase(TestCase):
    def setUp(self):
        self.order = OrderFactory.build()  
        self.client = ClientFactory.create()


    def test_order_serializer_valid(self):
        order_data = self.order.__dict__.copy()
        order_data['client'] = self.client.id
        serializer = OrderSerializer(data=order_data)
        self.assertTrue(serializer.is_valid(raise_exception=True))

    def test_order_serializer_required_fields(self):
        serializer = OrderSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('client', serializer.errors)
        self.assertIn('total', serializer.errors)


class OrderItemSerializerTestCase(TestCase):
    def setUp(self):
        self.order_item = OrderItemFactory.build()  
        self.order = OrderFactory.create()
    def test_order_item_serializer_valid(self):

        order_data = self.order_item.__dict__.copy()
        order_data['order'] = self.order.id
        serializer = OrderItemSerializer(data=order_data)
        self.assertTrue(serializer.is_valid(raise_exception=True))

    def test_order_item_serializer_required_fields(self):
        serializer = OrderItemSerializer(data={})
        self.assertFalse(serializer.is_valid())
        self.assertIn('order', serializer.errors)
        self.assertIn('quantity', serializer.errors)
