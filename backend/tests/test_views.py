from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .factories import ClientFactory
from rest_framework_simplejwt.tokens import RefreshToken
from custom_user.models import Category, Order, Product
import json

User = get_user_model()

class ProductAPITestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def test_get_all_products(self):
        response = self.client.get(reverse('get_all_products'))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [])

        Product.objects.create(name='Product 1', description='Description 1', price=10.0, quantity=5 ,date_added='2024-04-01')
        Product.objects.create(name='Product 2', description='Description 2', price=15.0, quantity=8 ,date_added='2024-04-01')

        response = self.client.get(reverse('get_all_products'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_get_filtered_products(self):
        response = self.client.get(reverse('get-filtered-products'))
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [])

        categoryA = Category.objects.create(id=1,name='Categoria_A')
        categoryB = Category.objects.create(id=2,name='Categoria_B')


        Product.objects.create(name='Product A', description='Description A', price=20.0, quantity=3, category=categoryA,date_added='2024-04-01')
        Product.objects.create(name='Product B', description='Description B', price=25.0, quantity=6, category=categoryB,date_added='2024-04-01')

        response = self.client.get(reverse('get-filtered-products') + '?price_min=21')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['name'], 'Product B')

        response = self.client.get(reverse('get-filtered-products') + '?product_type=Categoria_A')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['name'], 'Product A')


class AuthAPITestCase(TestCase):

    def setUp(self):
        self.client = Client()

    def test_register_view(self):
        url = reverse('register')
        data = {
            'email': 'test@example.com',
            'password': 'testpassword',
            'first_name': 'John',
            'last_name': 'Doe'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('refresh', response.json())
        self.assertIn('access', response.json())

        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Email already exists')

    def test_login_view(self):

        self.user = User.objects.create_user( email='test@example.com', password='testpassword')   

        url = reverse('login')
  
        data = {
            'email': 'test@example.com',
            'password': 'testpassword'
        }
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('refresh', response.json())
        self.assertIn('access', response.json())

        data['password'] = 'wrongpassword'
        response = self.client.post(url, data=json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Invalid credentials')

    def test_logout_view(self):
        user = User.objects.create_user(email='test@example.com', password='testpassword')
        self.client.login(email='test@example.com', password='testpassword')

        url = reverse('logout_view')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Logout successful')


class IndexAPITestCase(TestCase):

    def setUp(self):
        self.clien = ClientFactory.create()
        self.order = Order.objects.create(total=100.0, status='Pending',client_id=self.clien.id)


    def test_newest_products(self):
        Product.objects.create(name='Product X', description='Description X', price=30.0, quantity=4, date_added = '2024-06-06')
        Product.objects.create(name='Product Y', description='Description Y', price=35.0, quantity=7, date_added = '2024-06-06')

        response = self.client.get(reverse('newest-products'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_bestselling_products(self):
        product1 = Product.objects.create(name='Product P', description='Description P', price=40.0, quantity=6, date_added='2024-06-06')
        product2 = Product.objects.create(name='Product Q', description='Description Q', price=45.0, quantity=9, date_added='2024-06-06')
        
        product1.order_items.create(quantity=3, order=self.order)
        product2.order_items.create(quantity=5, order=self.order)
        
        response = self.client.get(reverse('bestselling-products'))
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)


class UserDataAPITestCase(TestCase):

    def test_get_user_data(self):
        user = User.objects.create_user(email='test@example.com', password='testpassword', first_name='John', last_name='Doe')

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        url = reverse('get-user-data')
        headers = {'HTTP_AUTHORIZATION': f'Bearer {access_token}'}
        response = self.client.get(url, **headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['email'], 'test@example.com')
        self.assertEqual(response.json()['first_name'], 'John')
        self.assertEqual(response.json()['last_name'], 'Doe')


