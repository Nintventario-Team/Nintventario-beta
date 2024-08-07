import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WishlistResponse } from '../interfaces/wishlist';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private backendUrl = 'https://nintventario.pythonanywhere.com/'
  //private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    })
  }

  addToWishlist(productId: number): Observable<unknown> {
    const headers = this.getAuthHeaders()
    return this.http.post(`${this.backendUrl}/wishlist/add/`, { product_id: productId }, { headers })
  }

  getWishlist(): Observable<WishlistResponse[]> {
    const headers = this.getAuthHeaders()
    return this.http.get<WishlistResponse[]>(`${this.backendUrl}/wishlist/`, { headers })
  }

  removeFromWishlist(productId: number): Observable<unknown> {
    const headers = this.getAuthHeaders()
    return this.http.post(`${this.backendUrl}/wishlist/remove/`, { product_id: productId }, { headers })
  }
}
