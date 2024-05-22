import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DataProviderService } from '../../../providers/data-provider.service';
import { Producto } from '../../../interfaces/producto';
import { Carrito } from '../../../interfaces/carrito';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { HistorialCompras } from '../../../interfaces/historial-compras';

@Component({
  selector: 'app-confirmar-compra',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './confirmar-compra.component.html',
  styleUrl: './confirmar-compra.component.css',
})
export class ConfirmarCompraComponent {
  public products?: Producto[];
  public productshop?: Carrito[];

  //simula el id del usuario logeado
  public userID: number = 1;

  constructor(
    private _snackBar: MatSnackBar,
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      panelClass: ['custom-snackbar'],
    });
  }

  getCorrespondingProduct(productID: number): Producto | undefined {
    return this.products?.find((product) => product.id === productID);
  }

  calculateTotal(productID: number, cantidad: number): number {
    const product = this.getCorrespondingProduct(productID);
  
    if (!product) {
      return 0;
    }
  
    const subtotal = parseFloat((product.precio * cantidad).toFixed(2));
    const iva = parseFloat((subtotal * 0.12).toFixed(2));
  
    return parseFloat((subtotal + iva).toFixed(2));
  }
  

  makePurchase() {
    this.openSnackBar('Su compra fue realizada exitosamennte', 'cerrar');
    this.dataProvider.clearCart(this.userID).subscribe(
      (error) => {
        console.error(error);
      }
    );

    this.productshop?.map((prod)=>{
      var historyData: HistorialCompras = {
        id: 1,
        usuario_id: this.userID,
        producto_id: prod.producto_id,
        cantidad: prod.cantidad,
        precio_total: this.calculateTotal(prod.producto_id,prod.cantidad),
        fecha_compra: "2023-02-28"
      };


      this.dataProvider.addShoppingHistory(historyData).subscribe(
      (error) => {
        console.error(error);
      })
    })
   
  }
}
