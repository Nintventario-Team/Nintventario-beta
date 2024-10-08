import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

PAYPAL_CLIENT_ID = os.getenv('PAYPAL_CLIENT_ID')
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"
IVA = 0.12

def generate_access_token():
    if not PAYPAL_CLIENT_ID or not PAYPAL_CLIENT_SECRET:
        raise ValueError('No hay Credenciales')
    
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()).decode('utf-8')
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials"
    }
    response = requests.post(f"{PAYPAL_BASE_URL}/v1/oauth2/token", headers=headers, data=data)
    response.raise_for_status()
    return response.json()['access_token']

def handle_response(response):
    try:
        response.raise_for_status()
        return response.json(), response.status_code
    except requests.exceptions.HTTPError as err:
        return str(err), response.status_code

def create_order(cart):
    print("Creando Orden")
    print(cart)
    # Calcular el subtotal del carrito
    cart_subtotal = sum(float(p['price']) * p['quantityToBuy'] for p in cart)

    # Calcular el IVA del carrito 
    cart_iva = cart_subtotal * IVA

    # Calcular el total del carrito
    cart_total = round(cart_subtotal + cart_iva, 2)

    access_token = generate_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "USD",
                    "value": f"{cart_total}"  # Usar detalles del carrito
                }
            }
        ],
        "application_context": {
            "shipping_preference": "NO_SHIPPING"
        }
    }
    response = requests.post(f"{PAYPAL_BASE_URL}/v2/checkout/orders", headers=headers, json=payload)
    print("Orden creada")
    return handle_response(response)

def capture_order(order_id):
    access_token = generate_access_token()
    url = f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.post(url, headers=headers)
    return handle_response(response)
