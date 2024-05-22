import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataProviderService } from '../../providers/data-provider.service';
import { Carrito } from '../../interfaces/carrito';
import { Producto } from '../../interfaces/producto';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.css',
})
export class CajaComponent {
  public products?: Producto[];
  public productshop?: Carrito[];

  //simula el id del usuario logeado
  public userID: number = 1;

  constructor(
    private router: Router,
    private dataProvider: DataProviderService
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

  getSubtotal(): number {
    return this.productshop
      ? parseFloat(
          this.productshop
            ?.reduce(
              (total, data) =>
                total +
                data.cantidad *
                  this.getCorrespondingProduct(data.producto_id)!.precio,
              0
            )
            .toFixed(2)
        )
      : 0;
  }
  getIVA(): number {
    return parseFloat((this.getSubtotal() * 0.12).toFixed(2));
  }
  getTotal(): number {
    return parseFloat((this.getSubtotal() + this.getIVA()).toFixed(2));
  }
}
