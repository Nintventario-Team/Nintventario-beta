
from django.db import IntegrityError
from django.forms import ValidationError
from django.test import TestCase
from custom_user.models import User, Client, Category, Product, Order, OrderItem
from tests.factories import UserFactory, ClientFactory, CategoryFactory, ProductFactory, OrderFactory, OrderItemFactory

class UserModelTestCase(TestCase):
    def setUp(self):
        self.user = UserFactory.create()

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)

    def test_user_str(self):
        self.assertEqual(str(self.user), self.user.email)


class ClientModelTestCase(TestCase):
    def setUp(self):
        self.client = ClientFactory.create()

    def test_client_creation(self):
        self.assertEqual(Client.objects.count(), 1)

    def test_client_relations(self):
        self.assertEqual(self.client.user.clients.count(), 1)

    def test_max_length_fields(self):
        with self.assertRaises(IntegrityError):
            Client.objects.create(dni='12345678901234567890', direction='Too long'*30,
                                  cellphone='123456789012345', city='Too long'*10)

    def test_client_dni_uniqueness(self):
        client1 = ClientFactory.create()
        with self.assertRaises(IntegrityError):  
            ClientFactory.create(dni=client1.dni)


class CategoryModelTestCase(TestCase):
    def setUp(self):
        self.category = CategoryFactory.create()

    def test_category_creation(self):
        self.assertEqual(Category.objects.count(), 1)

    def test_unique_name(self):
        with self.assertRaises(IntegrityError):
            CategoryFactory.create(name=self.category.name)


class ProductModelTestCase(TestCase):
    def setUp(self):
        self.product = ProductFactory.create()

    def test_product_creation(self):
        self.assertEqual(Product.objects.count(), 1)

    def test_product_relations(self):
        self.assertEqual(self.product.category.products.count(), 1)

   
class OrderModelTestCase(TestCase):
    def setUp(self):
        self.order = OrderFactory.create()

    def test_order_creation(self):
        self.assertEqual(Order.objects.count(), 1)

    def test_order_relations(self):
        self.assertEqual(self.order.client.orders.count(), 1)

    def test_required_fields(self):
        with self.assertRaises(IntegrityError):
            Order.objects.create(client=None, total=100, status='Pending')


class OrderItemModelTestCase(TestCase):
    def setUp(self):
        self.order_item = OrderItemFactory.create()

    def test_order_item_creation(self):
        self.assertEqual(OrderItem.objects.count(), 1)

    def test_order_item_relations(self):
        self.assertEqual(self.order_item.order.items.count(), 1)
        self.assertEqual(self.order_item.product.order_items.count(), 1)

    def test_order_item_quantity(self):
        self.assertTrue(self.order_item.quantity > 0)
