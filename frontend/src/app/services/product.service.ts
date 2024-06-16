import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getNewestProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/newest-products/`);
  }

  getBestsellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/bestselling-products/`);
  } 

}
