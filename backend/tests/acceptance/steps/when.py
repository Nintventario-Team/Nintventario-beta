from behave import when
from tests.factories import OrderFactory, ClientFactory
import json
from rest_framework_simplejwt.tokens import RefreshToken

@when('I attempt to create an order with a quantity of "{quantity}" for that product')
def step_when_attempt_to_create_order_with_quantity(context, quantity):
    refresh = RefreshToken.for_user(context.user)
    access_token = str(refresh.access_token)
    client = ClientFactory(user=context.user)
    total = context.product.price * int(quantity)
    status = 0  

    order_data = {
        'client': client.id,
        'total': float(total),  
        'status': status,
        'items': [{'product': context.product.id, 'quantity': int(quantity)}]
    }

    response = context.client.post(
        '/create-order/',
        data=json.dumps(order_data),
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {access_token}'
    )
    context.response = response



@when('I attempt to view the product with ID "{product_id}"')
def step_when_attempt_to_view_product_with_id(context, product_id):
    response = context.client.get(f'/get-product-id/{product_id}/')
    context.response = response

import json
from behave import when

@when('I attempt to register with the email "{email}"')
def step_when_attempt_to_register_with_email(context, email):
    payload = {
        'email': email,
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    response = context.client.post(
        '/register/',
        data=json.dumps(payload),
        content_type='application/json'
    )
    context.response = response


@when('I add a new product with name "{name}" and price "{price}"')
def step_when_add_new_product(context, name, price):
    response = context.client.post('/admin/products/', {
        'name': name,
        'description': 'Admin added product',
        'price': float(price),
        'quantity': 10,
        'date_added': '2024-01-01'
    })
    context.response = response

@when('I update the product\'s name to "{new_name}"')
def step_when_update_product_name(context, new_name):
    response = context.client.put(f'/admin/products/{context.product.id}/', {
        'name': new_name,
        'description': context.product.description,
        'price': context.product.price,
        'quantity': context.product.quantity,
        'date_added': context.product.date_added
    })
    context.response = response

@when('I delete the product')
def step_when_delete_product(context):
    response = context.client.delete(f'/admin/products/{context.product.id}/')
    context.response = response


@when('I view products filtered by the "{category_name}" category')
def step_when_view_filtered_products(context, category_name):
    response = context.client.get(f'/filteredProducts/?category={category_name}')
    context.response = response

@when('I send a contact email with subject "{subject}" and message "{message}"')
def step_when_send_contact_email(context, subject, message):
    payload = {
        'cedula': '1234567890',
        'nombres': 'Test User',
        'telefono': '0998765432',
        'email': 'testuser@example.com',
        'ciudad': 'Quito',
        'asunto': subject,
        'comentario': message
    }
    response = context.client.post(
        '/send-contact-email/',
        data=json.dumps(payload),
        content_type='application/json'
    )
    context.response = response


