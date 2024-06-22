import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartItem } from '../../interfaces/cartItem';
import { Product } from '../../interfaces/product'

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
  public bestSellers: Product[] = [];
  public newProducts: Product[] = [];
  showDetails: boolean = false;
  selectedProduct: Product | undefined;
 // public notice: News[] = this.newsService.updateNews().slice(0, 4);

  constructor(
   // private dataProvider: DataProviderService,
    //private router: Router,
    //private newsService: NewsService,
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
