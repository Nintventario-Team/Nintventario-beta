from django.test import TestCase
from custom_user.models import User, Client, Category, Product, Order, OrderItem, WishlistItem
from .factories import UserFactory, ClientFactory, CategoryFactory, ProductFactory, OrderFactory, OrderItemFactory, WishlistItemFactory

class UserModelTest(TestCase):
    
    def test_user_creation(self):
        user = UserFactory()
        self.assertTrue(isinstance(user, User))
        self.assertEqual(str(user), user.email)
    
    def test_user_password_is_hashed(self):
        user = UserFactory(password='mysecret')
        self.assertNotEqual(user.password, 'mysecret')
        self.assertTrue(user.check_password('mysecret'))

class ClientModelTest(TestCase):
    
    def test_client_creation(self):
        client = ClientFactory()
        self.assertTrue(isinstance(client, Client))
        self.assertEqual(str(client), client.dni)
    
    def test_client_user_relationship(self):
        client = ClientFactory()
        self.assertTrue(isinstance(client.user, User))

class CategoryModelTest(TestCase):
    
    def test_category_creation(self):
        category = CategoryFactory()
        self.assertTrue(isinstance(category, Category))
        self.assertEqual(str(category), category.name)
    
    def test_category_name_uniqueness(self):
        category = CategoryFactory(name='Electronics')
        with self.assertRaises(Exception):
            CategoryFactory(name='Electronics')

class ProductModelTest(TestCase):
    
    def test_product_creation(self):
        product = ProductFactory()
        self.assertTrue(isinstance(product, Product))
        self.assertEqual(str(product), product.name)
    
    def test_product_category_relationship(self):
        product = ProductFactory()
        self.assertTrue(isinstance(product.category, Category))
    
    def test_product_price(self):
        product = ProductFactory(price=100.00)
        self.assertEqual(product.price, 100.00)

class OrderModelTest(TestCase):
    
    def test_order_creation(self):
        order = OrderFactory()
        self.assertTrue(isinstance(order, Order))
    
    def test_order_client_relationship(self):
        order = OrderFactory()
        self.assertTrue(isinstance(order.client, Client))
    
    def test_order_status(self):
        order = OrderFactory(status='Pending')
        self.assertEqual(order.status, 'Pending')

class OrderItemModelTest(TestCase):
    
    def test_orderitem_creation(self):
        order_item = OrderItemFactory()
        self.assertTrue(isinstance(order_item, OrderItem))
    
    def test_orderitem_relationships(self):
        order_item = OrderItemFactory()
        self.assertTrue(isinstance(order_item.order, Order))
        self.assertTrue(isinstance(order_item.product, Product))

class WishlistItemModelTest(TestCase):
    
    def test_wishlistitem_creation(self):
        wishlist_item = WishlistItemFactory()
        self.assertTrue(isinstance(wishlist_item, WishlistItem))
    
    def test_wishlistitem_relationships(self):
        wishlist_item = WishlistItemFactory()
        self.assertTrue(isinstance(wishlist_item.user, User))
        self.assertTrue(isinstance(wishlist_item.product, Product))
    
    def test_wishlistitem_uniqueness(self):
        wishlist_item = WishlistItemFactory()
        with self.assertRaises(Exception):
            WishlistItemFactory(user=wishlist_item.user, product=wishlist_item.product)
