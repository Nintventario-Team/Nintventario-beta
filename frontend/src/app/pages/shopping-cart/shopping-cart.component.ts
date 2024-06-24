import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Location } from '@angular/common'
import { RouterLinkActive, RouterLink, Router } from '@angular/router'
import { CartItem } from '../../interfaces/cartItem'

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  public productshop?: CartItem[]

  isCartEmpty: boolean = true

  constructor(
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const cartItem = localStorage.getItem('cart')
    if (cartItem !== null) {
      try {
        this.productshop = JSON.parse(cartItem)
        this.isCartEmpty = false
      } catch (e) {
        console.error('Error parsing cart data:', e)
      }
    } else {
      this.productshop = []
    }
    //TO-DO actualizar maxquantity
  }
  getSubtotal(productID: number): number {
    const product = this.productshop?.find(item => item.id === productID)
    return product ? parseFloat((product.price * product.quantityToBuy).toFixed(2)) : 0
  }
  getIVA(productID: number): number {
    return parseFloat((this.getSubtotal(productID) * 0.12).toFixed(2))
  }
  getTotal(productID: number): number {
    return parseFloat((this.getSubtotal(productID) + this.getIVA(productID)).toFixed(2))
  }

  updateQuantity($event: Event, id: number) {
    const input = $event.target as HTMLInputElement
    const product = this.productshop?.find(product => product.id === id)

    if (parseInt(input.value) <= product!.maxQuantity) {
      product!.quantityToBuy = parseInt(input.value)
    }
  }

  goToCheckout() {
    localStorage.setItem('cart', JSON.stringify(this.productshop))
    this.router.navigate(['/caja'])
  }
  keepBuying() {
    localStorage.setItem('cart', JSON.stringify(this.productshop))
    this.location.back()
  }

  preventTyping($event: KeyboardEvent) {
    $event.preventDefault()
  }
}
