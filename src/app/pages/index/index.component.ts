import { Component } from '@angular/core';
import { DataProviderService } from '../../providers/data-provider.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Producto } from '../../interfaces/producto';
import { Noticia } from '../../interfaces/noticia';
import { Carrito } from '../../interfaces/carrito';
import { NoticiasService } from '../../services/noticias.service';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    NgxPaginationModule,
    RouterLinkActive,
    RouterLink,
  ],
  providers: [DataProviderService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  //simula el id del usuario logeado
  public userID: number = 1;
  public bestSellers: Producto[] = [];
  public newProducts: Producto[] = [];
  showDetails: boolean = false;
  public selectedProduct!: Producto;
  public notice: Noticia[] = this.noticiasService.updateNoticias().slice(0, 4);

  constructor(
    private dataProvider: DataProviderService,
    private router: Router,
    private noticiasService: NoticiasService
  ) {}
  ngOnInit() {
    this.getData();
  }

  openDetails(producto: Producto) {
    this.showDetails = true;
    this.selectedProduct = producto;
  }

  closeDetails() {
    this.showDetails = false;
  }

  addCart() {
    var productCart: Carrito = {
      id: 1,
      usuario_id: this.userID,
      producto_id: this.selectedProduct.id,
      cantidad: 1,
    };
    this.dataProvider.addToCart(productCart).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        console.error(error);
        this.router.navigate(['/carrito']);
      }
    );
  }

  getData() {
    this.dataProvider.getProductsMostSold().subscribe((response) => {
      if (Array.isArray(response)) {
        let dataArray = response as Producto[];
        this.bestSellers = dataArray.slice(0, 4);
      } else {
        this.bestSellers = [];
        console.error('La respuesta no es un array:', response);
      }
    });

    this.dataProvider.getProductsByNews().subscribe((response) => {
      if (Array.isArray(response)) {
        let dataArray = response as Producto[];
        this.newProducts = dataArray.slice(0, 4);
      } else {
        this.newProducts = [];
        console.error('La respuesta no es un array:', response);
      }
    });
  }
}
