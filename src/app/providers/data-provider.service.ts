import { Injectable } from '@angular/core';

//Importación del HttpClient
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto';

import { HistorialCompras } from '../interfaces/historial-compras';
import { Carrito } from '../interfaces/carrito';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataProviderService {
  private URLProducts: string = 'http://localhost/api/products.php?';
  private URLCart: string = 'http://localhost/api/cart.php?';
  private URLShoppingHistory: string =
    'http://localhost/api/shoppingHistory.php?';

  constructor(private http: HttpClient) {}
  // Obtener productos por rango de precio y/o tipo usando el API
  getProductsByRangeAndType(
    minPrice?: number,
    maxPrice?: number,
    tipo?: string
  ) {
    let params = '';

    if (minPrice !== undefined && maxPrice !== undefined) {
      params += `&findByPriceRange&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }

    if (tipo !== undefined) {
      params += `&findByType=${tipo}`;
    }

    return this.http.get(this.URLProducts + params);
  }

  getAllProducts() {
    return this.http.get(this.URLProducts + 'findAll');
  }

  getProductByID(productID: number) {
    return this.http.get(this.URLProducts + `findByID=${productID}`);
  }

  getShoppingCart(userID: number) {
    return this.http.get(this.URLCart + `findShoppingCart=${userID}`);
  }

  addToCart(productData: Carrito) {
    const data = {
      usuario_id: productData.usuario_id,
      producto_id: productData.producto_id,
      cantidad: productData.cantidad,
    };
    return this.http.post(this.URLCart, JSON.stringify(data));
  }

  clearCart(userID: number): Observable<any> {
    const url = `${this.URLCart}usuario_id=${userID}`;
    return this.http.delete(url);
  }

  updateCart(data: Carrito) {
    return this.http.put(this.URLCart, JSON.stringify(data));
  }

  addShoppingHistory(data: HistorialCompras) {
    return this.http.post(this.URLShoppingHistory, JSON.stringify(data));
  }

  getProductsByNameAndType(
    name?: string,
    tipo?: string
  ){
    let params = '';
    if (name !== undefined) {
      params += `&findByName=${name}`;
    }
    if (tipo !== undefined) {
      params += `&findByType=${tipo}`;
    }
    return this.http.get(this.URLProducts + params);
  }

  getProductsByNews(){
    return this.http.get(this.URLProducts + 'findByNews');
  }

  getProductsByNameAndNew(
    name?: string,
  ){
    let params = '';
    if (name !== undefined) {
      params += `&findByName=${name}`;
      params += `&findByNew`;
    }
    
    return this.http.get(this.URLProducts + params);
  }

  getProductsMostSold(){
    return this.http.get(this.URLProducts + 'findMostSold');
  }

  getProductsByNameAndLeast(
    name?: string,
  ){
    let params = '';
    if (name !== undefined) {
      params += `&findByName=${name}`;
      params += `&findByLeast`;
    }
    
    return this.http.get(this.URLProducts + params);
  }

  getProductsByRangePrice(
    minPrice?: number,
    maxPrice?: number,
  ) {
    let params = '';
    if (minPrice !== undefined && maxPrice !== undefined) {
      params += `&findByPriceRange&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }
    return this.http.get(this.URLProducts + params);
  }

  getProductsByName(
    name?: string,
  ){
    let params = '';
    if (name !== undefined) {
      params += `&findByName=${name}`;
    }
    return this.http.get(this.URLProducts + params);
  }

  getProductsByRangeAndNew(
    minPrice?: number,
    maxPrice?: number,
  ) {
    let params = '';

    if (minPrice !== undefined && maxPrice !== undefined) {
      params += `&findByPriceRange&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    }
    params += `&findByNew`;


    return this.http.get(this.URLProducts + params);
  }
}
