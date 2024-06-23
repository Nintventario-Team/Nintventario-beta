import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../interfaces/cartItem';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  providers: [ProductService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent {
  public bestSellers: Product[] = [];
  public newProducts: Product[] = [];
  showDetails: boolean = false;
  selectedProduct: Product | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.NewestProducts();
    console.log('entre a INIT');
    this.BestsellingProducts();
  }

  NewestProducts() {
    console.log('entre a NEWEST P');

    this.productService.getNewestProducts().subscribe({
      next: (data) => {
        this.newProducts = data;
        console.log('llame a PROsducTSER', data);
      },
      error: (error) => {
        console.error('Error fetching newest products:', error);
      },
    });
    console.log('termine a NEWEST P', this.newProducts);
  }

  BestsellingProducts() {
    this.productService.getBestsellingProducts().subscribe({
      next: (data) => {
        this.bestSellers = data;
      },
      error: (error) => {
        console.error('Error fetching bestselling products:', error);
      },
    });
  }

  openDetails(product: Product) {
    this.showDetails = true;
    this.selectedProduct = product;
  }

  closeDetails() {
    this.showDetails = false;
    this.selectedProduct = undefined;
  }

  addCart(): void {
    if (!this.selectedProduct) {
      console.error('No product selected.');
      return;
    }

    console.log(this.selectedProduct.id);

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

    console.log(cart);

    const itemIndex = cart.findIndex((item) => item.id === cartItem.id);

    console.log(itemIndex);

    if (itemIndex < 0) {
      cart.push(cartItem);
    } else {
      cart[itemIndex].quantityToBuy++;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
