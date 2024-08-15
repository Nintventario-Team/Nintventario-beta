import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { CartItem } from '../interfaces/cartItem'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = []
  private totalProductsSubject = new BehaviorSubject<number>(0)
  totalProducts$ = this.totalProductsSubject.asObservable()

  constructor() {
    const cartJson = localStorage.getItem('cart')
    if (cartJson) {
      this.cartItems = JSON.parse(cartJson)
      this.updateTotalProducts()
    }
  }

  addToCart(item: CartItem) {
    const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id)
    if (itemIndex < 0) {
      this.cartItems.push(item)
    } else {
      this.cartItems[itemIndex].quantityToBuy++
    }
    this.updateCart()
  }

  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems))
    this.updateTotalProducts()
  }

  private updateTotalProducts() {
    const total = this.cartItems.reduce((sum, item) => sum + item.quantityToBuy, 0)
    this.totalProductsSubject.next(total)
  }

  removeFromCart(productID: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== productID)
    this.updateCart()
  }

  resetCart() { 
    this.cartItems = []
    this.updateCart()
  }
}
