import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  RouterLinkActive,
  RouterLink,
  Router,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Product } from '../../interfaces/product';
import { CartItem } from '../../interfaces/cartItem';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLinkActive, RouterLink],
  providers: [],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit {
  section!:
    | 'todos'
    | 'videojuegos'
    | 'funkopop'
    | 'consolas'
    | 'coleccionables'
    | 'accesorios';
  data: Product[] = [];
  public totalProducts: Product[] = [];
  page = 1;
  showDetails = false;
  selectedProduct: Product | undefined;
  minPrice?: number = 0;
  maxPrice?: number = 1000;
  sortOrder: 'asc' | 'desc' = 'asc';
  searching: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.section = data['section'] as
        | 'todos'
        | 'videojuegos'
        | 'funkopop'
        | 'consolas'
        | 'coleccionables'
        | 'accesorios';
      this.route.queryParams.subscribe((params) => {
        this.searching = (params['q'] || '').toLowerCase();
        this.getFilteredData();
      });
    });
  }

  search(): void {
    if (!this.searching) {
      this.data = [...this.totalProducts];
    } else {
      this.data = this.totalProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searching)
      );
    }
  }

  getFilteredData(): void {
    const sectionMappings = {
      todos: '',
      consolas: 'consola',
      videojuegos: 'jue',
      funkopop: 'pop',
      coleccionables: 'muñecos',
      accesorios: 'acc',
    };

    const sectionToFilter = sectionMappings[this.section];

    this.productService.getFilteredProducts(this.minPrice, this.maxPrice, sectionToFilter)
    .subscribe(
      (products) => {
        this.data = this.totalProducts = products;
        this.sortProducts(this.sortOrder)
        this.search();
      }
    );
  }

  updatePriceRange(min: number, max: number): void {
    this.minPrice = min;
    this.maxPrice = max;
    this.getFilteredData();
  }

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

    const cartJson = localStorage.getItem('cart');
    if (cartJson) {
      try {
        cart = JSON.parse(cartJson);
      } catch (e) {
        console.error('Error parsing cart data:', e);
        cart = [];
      }
    }

    const itemIndex = cart.findIndex((item) => item.id === cartItem.id);

    if (itemIndex < 0) {
      cart.push(cartItem);
    } else {
      cart[itemIndex].quantityToBuy++;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
