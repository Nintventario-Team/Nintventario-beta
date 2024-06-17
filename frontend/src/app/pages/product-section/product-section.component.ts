import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,RouterLinkActive, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusquedaService } from '../../services/busqueda.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Product } from '../../interfaces/product';
import { CartItem } from '../../interfaces/cartItem';
import { ProductService} from '../../services/product.service'

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterLinkActive,
    RouterLink,
  ],
  providers: [],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css'
})
export class ProductSectionComponent implements OnInit {
  section!: 'videojuegos' | 'funkopop' | 'consolas' | 'coleccionables';
  data : Product[]=[]; 
  public totalProducts: Product[] = [];
  page = 1; 
  showDetails = false;
  selectedProduct: Product | undefined;
  minPrice?: number = 0;
  maxPrice?: number = 1000;


  constructor(private route: ActivatedRoute, private productService:ProductService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.section = data['section'] as ('videojuegos' | 'funkopop' | 'consolas' | 'coleccionables');
      this.getFilteredData();
    });
  }

  getFilteredData(): void {
    let sectionToFilter:string = '' ;
    if (this.section === 'consolas') {
      sectionToFilter = 'consola'
    } else if (this.section === 'videojuegos') {
      sectionToFilter = 'jue'
    } else if (this.section === 'funkopop') {
      sectionToFilter = 'pop'
    } else if (this.section === 'coleccionables') {
      sectionToFilter = 'muñecos'
    }

    this.productService.getFilteredProducts(this.minPrice, this.maxPrice, sectionToFilter)
    .subscribe(
      (products) => {
        this.data = this.totalProducts = products;
        this.sortProducts(this.sortOrder)

      }
    );
}

  updatePriceRange(min: number, max: number): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.getFilteredData();
    }
/*
  sortByPriceAscending() {
    this.page = 1; 
    this.data.sort((a, b) => a.price - b.price);
  }

  sortByPriceDescending() {
    this.page = 1; 
    this.data.sort((a, b) => b.price - a.price);
  }
*/
  sortOrder: 'asc' | 'desc' = 'asc'; 
  

  sortProducts(order: 'asc' | 'desc') {
    this.page = 1; 
    this.sortOrder = order;

    if (this.sortOrder === 'asc') {
      this.data.sort((a, b) => a.price - b.price);
    } else {
      this.data.sort((a, b) => b.price - a.price); 
    }
  }
  
  


  filterByGenre(genre: string): void {
    // Filtrar los videojuegos por género
  }

 

  openDetails(producto: any): void {
    this.selectedProduct = producto;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedProduct = undefined;
  }

  addCart(): void {
    if (!this.selectedProduct) {
        console.error('No product selected.');
        return;
    }

    console.log(this.selectedProduct.id)

    const cartItem: CartItem = {
        id: this.selectedProduct.id,
        name: this.selectedProduct.name,
        price: this.selectedProduct.price,
        maxQuantity: this.selectedProduct.quantity,
        quantityToBuy: 1,
        details: this.selectedProduct.details,
        image: this.selectedProduct.image,
    };


    let cart: CartItem[] = [];

    const cartJson = localStorage.getItem("cart");
    if (cartJson) {
        try {
            cart = JSON.parse(cartJson);
        } catch (e) {
            console.error('Error parsing cart data:', e);
            cart = [];
        }
    }

    console.log(cart)

    const itemIndex = cart.findIndex((item) => item.id === cartItem.id);

    console.log(itemIndex)

    if (itemIndex < 0) {
        cart.push(cartItem);
    } else {
        cart[itemIndex].quantityToBuy++;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

}