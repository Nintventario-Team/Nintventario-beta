import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Product } from '../interfaces/product'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //private backendUrl = 'https://jorgemawyin.pythonanywhere.com'
  private backendUrl = 'http://127.0.0.1:8000'

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.backendUrl}/products/`)
  }

  getFilteredProducts(priceMin?: number, priceMax?: number, productType?: string): Observable<Product[]> {
    let params = new HttpParams()
    if (priceMin !== undefined) {
      params = params.set('price_min', priceMin.toString())
    }
    if (priceMax !== undefined) {
      params = params.set('price_max', priceMax.toString())
    }
    if (productType !== undefined) {
      params = params.set('product_type', productType)
    }

    return this.http.get<Product[]>(`${this.backendUrl}/filteredProducts/`, {
      params,
    })
  }

  getNewestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.backendUrl}/newest-products/`)
  }

  getBestsellingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.backendUrl}/bestselling-products/`)
  }
  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.backendUrl}/get-product-id/${productId}`);
  }
}
