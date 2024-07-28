import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Location } from '@angular/common'
import { RouterLinkActive, RouterLink, Router } from '@angular/router'
import { CartItem } from '../../interfaces/cartItem'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-shopping-cart-modal',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './shopping-cart-modal.component.html',
  styleUrls: ['./shopping-cart-modal.component.css'],
})
export class ShoppingCartModalComponent {
  public productshop?: CartItem[]
  public displayedProducts?: CartItem[]
  public totalProducts: number = 0

  isCartEmpty: boolean = true

  constructor(
    private router: Router,
    private location: Location,
    public dialogRef: MatDialogRef<ShoppingCartModalComponent>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    const cartItem = localStorage.getItem('cart')
    if (cartItem !== null) {
      try {
        this.productshop = JSON.parse(cartItem)
        this.totalProducts = this.productshop ? this.productshop.length : 0
        this.displayedProducts = this.productshop ? this.productshop.slice(0, 3) : []
        this.isCartEmpty = this.totalProducts === 0
      } catch (e) {
        console.error('Error parsing cart data:', e)
      }
    } else {
      this.productshop = []
      this.isCartEmpty = true
    }
    // TO-DO actualizar maxQuantity
  }

  replaceUnderscores(name: string): string {
    return name.replace(/_/g, ' ')
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

  getCartSubtotal(): number {
    return parseFloat(
      this.productshop?.reduce((acc, product) => acc + this.getSubtotal(product.id), 0).toFixed(2) || '0',
    )
  }

  getCartIVA(): number {
    return parseFloat((this.productshop?.reduce((acc, product) => acc + this.getIVA(product.id), 0) || 0).toFixed(2))
  }

  getCartTotal(): number {
    return parseFloat((this.getCartSubtotal() + this.getCartIVA()).toFixed(2))
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
    this.dialogRef.close()
    this.router.navigate(['/payment'])
  }

  keepBuying() {
    this.dialogRef.close()
  }

  preventTyping($event: KeyboardEvent) {
    $event.preventDefault()
  }

  closeModal() {
    this.dialogRef.close()
  }
}
