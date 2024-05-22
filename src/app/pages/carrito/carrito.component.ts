import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
//Importación del servicio
import { DataProviderService } from '../../providers/data-provider.service';
import { HttpClientModule } from '@angular/common/http';
import { Producto } from '../../interfaces/producto';

import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { Carrito } from '../../interfaces/carrito';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLinkActive, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  public products?: Producto[];
  public productshop?: Carrito[];

  //simula el id del usuario logeado
  public userID: number = 1;

  constructor(
    private dataProvider: DataProviderService,
    private router: Router,
    private location: Location
  ) {
    this.dataProvider.getShoppingCart(this.userID).subscribe((cartResponse) => {
      this.productshop = cartResponse as Carrito[];

      const productObservables = this.productshop.map((cart) => {
        return this.dataProvider.getProductByID(cart.producto_id);
      });

      forkJoin(productObservables).subscribe((productResponses) => {
        this.products = productResponses.map((response) => {
          var res = response as Producto[];
          return res[0];
        });
      });
    });
  }
  getCorrespondingProduct(productID: number): Producto | undefined {
    return this.products?.find((product) => product.id === productID);
  }

  getSubtotal(productID: number, cantidad: number): number {
    var product = this.getCorrespondingProduct(productID);
    return product ? parseFloat((product.precio * cantidad).toFixed(2)) : 0;
  }
  getIVA(productID: number, cantidad: number): number {
    return parseFloat(
      (this.getSubtotal(productID, cantidad) * 0.12).toFixed(2)
    );
  }
  getTotal(productID: number, cantidad: number): number {
    return parseFloat(
      (
        this.getSubtotal(productID, cantidad) + this.getIVA(productID, cantidad)
      ).toFixed(2)
    );
  }

  updateQuantity($event: Event, id: number) {
    var input = $event.target as HTMLInputElement;
    var product = this.productshop?.find((product) => product.id === id);
    product!.cantidad = parseInt(input.value);
  }

  goToCheckout() {
    this.productshop?.map((cart) =>
      this.dataProvider.updateCart(cart).subscribe()
    );
    this.router.navigate(['/caja']);
  }
  keepBuying() {
    this.productshop?.map((cart) =>
      this.dataProvider.updateCart(cart).subscribe()
    );
    this.location.back(); 
  }
}
