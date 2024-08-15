from django.test import TestCase, Client as DjangoClient
from django.urls import reverse
from rest_framework.test import APIClient
from custom_user.models import User, Product, Order, WishlistItem, Client
from .factories import UserFactory, ProductFactory, OrderFactory, WishlistItemFactory, ClientFactory
import json

class ProductViewsTest(TestCase):

    def setUp(self):
        self.client = DjangoClient()
        self.api_client = APIClient()
        self.user = UserFactory()
        self.product = ProductFactory()
    
    def test_get_all_products(self):
        url = reverse('get_all_products')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('name', response.json()[0])
    
    def test_get_filtered_products(self):
        ProductFactory(price=50)  # Dentro del rango
        ProductFactory(price=90)  # Dentro del rango
        ProductFactory(price=150) # Fuera del rango
        url = reverse('get-filtered-products')
        response = self.client.get(url, {'price_min': 10, 'price_max': 100})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) > 0)

class EmailViewsTest(TestCase):

    def setUp(self):
        self.client = DjangoClient()

    def test_send_contact_email(self):
        url = reverse('send_contact_email')
        data = {
            'cedula': '1234567890',
            'nombres': 'John Doe',
            'telefono': '0999999999',
            'email': 'johndoe@example.com',
            'ciudad': 'Guayaquil',
            'asunto': 'Consulta',
            'comentario': 'Quisiera más información sobre el producto.'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Correo enviado exitosamente', response.json()['message'])

    def test_send_register_email(self):
        url = reverse('send_register_email')
        data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'johndoe@example.com'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Correo enviado exitosamente', response.json()['message'])

class AuthViewsTest(TestCase):

    def setUp(self):
        self.client = DjangoClient()
        self.api_client = APIClient()
        self.user = UserFactory(password='password123')

    def test_login_view_success(self):
        url = reverse('login')
        data = {
            'email': self.user.email,
            'password': 'password123'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())

    def test_login_view_invalid_credentials(self):
        url = reverse('login')
        data = {
            'email': self.user.email,
            'password': 'wrongpassword'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid credentials', response.json()['error'])

    def test_register_view_success(self):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'password': 'password123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())

    def test_register_view_existing_email(self):
        url = reverse('register')
        data = {
            'email': self.user.email,
            'password': 'password123',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        response = self.client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Email already exists', response.json()['error'])

    def test_logout_view(self):
        url = reverse('logout_view')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('Logout successful', response.json()['message'])

class ProductDetailViewTest(TestCase):

    def setUp(self):
        self.client = DjangoClient()
        self.product = ProductFactory()

    def test_get_product_by_id(self):
        url = reverse('get_product_by_id', args=[self.product.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['name'], self.product.name)

    def test_get_product_by_id_not_found(self):
        url = reverse('get_product_by_id', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)
        self.assertIn('Product not found', response.json()['error'])

class OrderViewsTest(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.user = UserFactory()
        self.client_instance = ClientFactory(user=self.user)
        self.product = ProductFactory()
        self.api_client.force_authenticate(user=self.user)

    def test_create_order_success(self):
        url = reverse('create_order')
        data = {
            'client': self.client_instance.id,
            'total': '100.00',
            'status': 0,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 2
                }
            ]
        }
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], '0')

    def test_create_order_insufficient_quantity(self):
        self.product.quantity = 1
        self.product.save()
        url = reverse('create_order')
        data = {
            'client': self.client_instance.id,
            'total': '100.00',
            'status': 0,
            'items': [
                {
                    'product': self.product.id,
                    'quantity': 2
                }
            ]
        }
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())  
        self.assertIn('Insufficient quantity', response.json()['error'])


class WishlistViewsTest(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.user = UserFactory()
        self.product = ProductFactory()
        self.api_client.force_authenticate(user=self.user)

    def test_add_to_wishlist(self):
        url = reverse('add_to_wishlist')
        data = {'product_id': self.product.id}
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('Product added to wishlist', response.json()['message'])

    def test_add_to_wishlist_already_exists(self):
        WishlistItemFactory(user=self.user, product=self.product)
        url = reverse('add_to_wishlist')
        data = {'product_id': self.product.id}
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Product already in wishlist', response.json()['message'])

    def test_remove_from_wishlist(self):
        WishlistItemFactory(user=self.user, product=self.product)
        url = reverse('remove_from_wishlist')
        data = {'product_id': self.product.id}
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Product removed from wishlist', response.json()['message'])

    def test_remove_from_wishlist_not_found(self):
        url = reverse('remove_from_wishlist')
        data = {'product_id': 9999}
        response = self.api_client.post(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertIn('Product does not exist', response.json()['error'])

class UserDataViewTest(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.user = UserFactory()
        self.api_client.force_authenticate(user=self.user)

    def test_get_user_data(self):
        url = reverse('get-user-data')
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['email'], self.user.email)

class PurchaseHistoryViewTest(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.user = UserFactory()
        self.client_instance = ClientFactory(user=self.user)
        self.api_client.force_authenticate(user=self.user)
        self.order = OrderFactory(client=self.client_instance)

    def test_get_purchase_history(self):
        url = reverse('purchase-history')
        response = self.api_client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['id'], self.order.id)
