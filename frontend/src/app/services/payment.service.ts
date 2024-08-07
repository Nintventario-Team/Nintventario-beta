import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CartItem} from '../interfaces/cartItem'
import {PayPalOrder,PayPalCaptureResponse} from '../interfaces/paypal-types'

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private backendUrl = 'https://nintventario.pythonanywhere.com/'

  //private backendUrl = 'http://127.0.0.1:8000'

  constructor(private http: HttpClient) {}

  createOrder(cart: CartItem): Observable<PayPalOrder> {
    return this.http.post<PayPalOrder>(`${this.backendUrl}/payments/create-order/`, { cart })
  }

  captureOrder(orderID: string): Observable<PayPalCaptureResponse> {
    return this.http.post<PayPalCaptureResponse>(`${this.backendUrl}/payments/capture-order/${orderID}/`, {})
  }
}
