from django.shortcuts import render
from django.http import JsonResponse
from payments.payment_functions import capture_order, create_order
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['POST'])
def create_order_view(request):
    try:
        cart = request.data.get('cart')
        jsonResponse, httpStatusCode = create_order(cart)
        return JsonResponse(jsonResponse, status=httpStatusCode)
        
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)

@api_view(['POST'])
def capture_order_view(request, order_id):
    try:
        jsonResponse, httpStatusCode = capture_order(order_id)
        return JsonResponse(jsonResponse,safe=False, status=httpStatusCode)
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=500)
