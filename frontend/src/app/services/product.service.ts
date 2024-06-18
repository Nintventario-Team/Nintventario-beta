import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private backendUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getAllProducts():Observable<Product[]> {
    return this.http.get<any[]>(`${this.backendUrl}/products/`);
  }

  getFilteredProducts(priceMin?: number, priceMax?: number, productType?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (priceMin !== undefined) {
      params = params.set('price_min', priceMin.toString());
    }
    if (priceMax !== undefined) {
      params = params.set('price_max', priceMax.toString());
    }
    if (productType !== undefined) {
      params = params.set('product_type', productType);
    }

    return this.http.get<Product[]>(`${this.backendUrl}/filteredProducts/`, { params });
  }
  
  getNewestProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/newest-products/`);
  }

  getBestsellingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/bestselling-products/`);
  } 

}
