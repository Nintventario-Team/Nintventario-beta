import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderResponse } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  //private backendUrl = 'https://jorgemawyin.pythonanywhere.com'
  private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  createOrder(orderData: Order): Observable<OrderResponse> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    });
    return this.http.post<OrderResponse>(`${this.backendUrl}/create-order/`, orderData, { headers });

  }

  getPurchaseHistory(): Observable<OrderResponse[]> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('accessToken')
    });
    return this.http.get<OrderResponse[]>(`${this.backendUrl}/purchase-history/`, { headers });

  }
}
