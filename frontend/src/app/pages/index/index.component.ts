import { Component } from '@angular/core';
//import { DataProviderService } from '../../providers/data-provider.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

import { Product } from '../../interfaces/product';
import { News } from '../../interfaces/news';
import { NewsService } from '../../services/news.service';

/*import { NgxPaginationModule } from 'ngx-pagination';
import { Product } from '../../interfaces/product';
import { Noticia } from '../../interfaces/noticia';
import { Carrito } from '../../interfaces/carrito';
import { NoticiasService } from '../../services/noticias.service';
*/
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
   // NgxPaginationModule,
    RouterLinkActive,
    RouterLink,
  ],
  providers: [/*DataProviderService*/],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  //simula el id del usuario logeado
  public userID: number = 1;
  public bestSellers: any[] = [];
  public newProducts: any[] = [];
  showDetails: boolean = false;
  selectedProduct: any;
  public notice: News[] = this.newsService.updateNews().slice(0, 4);

  constructor(
   // private dataProvider: DataProviderService,
    private router: Router,
    private newsService: NewsService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getNewestProducts();
    this.getBestsellingProducts();
  }

  getNewestProducts() {
    this.productService.getNewestProducts().subscribe({
      next: (data) => {
        this.newProducts = data;
      },
      error: (error) => {
        console.error('Error fetching newest products:', error);
      }
    });
  }

  getBestsellingProducts() {
    this.productService.getBestsellingProducts().subscribe({
      next: (data) => {
        this.bestSellers = data;
      },
      error: (error) => {
        console.error('Error fetching bestselling products:', error);
      }
    });
  }

  openDetails(product: any) {
    this.showDetails = true;
    this.selectedProduct = product;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedProduct = undefined;
  }

  addCart() {/*
    var productCart: Carrito = {
      id: 1,
      usuario_id: this.userID,
      product_id: this.selectedProduct.id,
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
    );*/
  }

  getData() {/*
    this.dataProvider.getProductsMostSold().subscribe((response) => {
      if (Array.isArray(response)) {
        let dataArray = response as Product[];
        this.bestSellers = dataArray.slice(0, 4);
      } else {
        this.bestSellers = [];
        console.error('La respuesta no es un array:', response);
      }
    });

    this.dataProvider.getProductsByNews().subscribe((response) => {
      if (Array.isArray(response)) {
        let dataArray = response as Product[];
        this.newProducts = dataArray.slice(0, 4);
      } else {
        this.newProducts = [];
        console.error('La respuesta no es un array:', response);
      }
    });*/
  }
}
