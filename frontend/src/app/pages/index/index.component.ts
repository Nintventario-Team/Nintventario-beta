import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})

export class IndexComponent implements OnInit {
  newProducts: any[] = [];
  bestSellers: any[] = [];
  showDetails: boolean = false;
  selectedProduct: any;

  constructor(private productService: ProductService) { }

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

  addCart() {
    // Aquí puedes implementar la lógica para agregar el producto al carrito
    console.log('Product added to cart:', this.selectedProduct);
  }
}

