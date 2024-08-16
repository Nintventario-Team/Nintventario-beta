import { Component, Inject, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Location } from '@angular/common'
import { RouterLinkActive, RouterLink, Router } from '@angular/router'
import { CartItem } from '../../interfaces/cartItem'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { AuthService } from '../../services/auth.service'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'
import { CartService } from '../../services/cart.service'

@Component({
  selector: 'app-shopping-cart-modal',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, AlertComponent],
  templateUrl: './shopping-cart-modal.component.html',
  styleUrls: ['./shopping-cart-modal.component.css'],
})
export class ShoppingCartModalComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  public productshop?: CartItem[]
  public displayedProducts?: CartItem[]
  public totalProducts: number = 0
  public IVA = 0.12
  isCartEmpty: boolean = true
  isLoggedIn: boolean = false
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''

  constructor(
    private cartService: CartService,
    private alertService: AlertService,
    private router: Router,
    private location: Location,
    public dialogRef: MatDialogRef<ShoppingCartModalComponent>,
    private authService: AuthService,

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

    this.isLoggedIn = this.authService.checkLoginStatus()

    this.authService.isLoggedIn$.subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn))
    // TO-DO actualizar maxQuantity
  }

  replaceUnderscores(name: string): string {
    return name.replace(/_/g, ' ')
  }

  getSubtotal(productID: number): number {
    const product = this.productshop?.find(item => item.id === productID)
    return product ? parseFloat((product.price * product.quantityToBuy).toFixed(5)) : 0
  }

  getIVA(productID: number): number {
    return parseFloat((this.getSubtotal(productID) * this.IVA).toFixed(5))
  }

  getTotal(productID: number): number {
    return parseFloat((this.getSubtotal(productID) + this.getIVA(productID)).toFixed(5))
  }

  getCartSubtotal(): number {
    return parseFloat(
      this.productshop?.reduce((acc, product) => acc + this.getSubtotal(product.id), 0).toFixed(5) || '0',
    )
  }

  getCartIVA(): number {
    return parseFloat((this.productshop?.reduce((acc, product) => acc + this.getIVA(product.id), 0) || 0).toFixed(5))
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

  increaseQuantity(product: CartItem) {
    if (product.quantityToBuy < product.maxQuantity) {
      product.quantityToBuy++
      product.updatedPrice = this.getUpdatedPrice(product)
      this.updateCart()
    }
  }

  decreaseQuantity(product: CartItem) {
    if (product.quantityToBuy > 1) {
      product.quantityToBuy--
      product.updatedPrice = this.getUpdatedPrice(product)
      this.updateCart()
    } else {
          this.deleteCartItem(product.id)
      }
    }

  getUpdatedPrice(product: CartItem): number {
    return parseFloat((product.price * product.quantityToBuy).toFixed(2))
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.productshop))
  }

  deleteCartItem(productID: number) {
    this.alertTopic = 'Eliminar artículo del carrito'
    this.alertMessage = '¿Estás seguro de que deseas eliminar este artículo del carrito?'
    this.alertType = 'confirm'
    this.alertComponent.resetAlert()
    const subscription = this.alertComponent.confirmAction.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.cartService.removeFromCart(productID)
        this.productshop = this.productshop?.filter(item => item.id !== productID)
      }
      this.dialogRef.close()
      subscription.unsubscribe()
    })
    /*
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este artículo del carrito?')
    if (confirmation) {
      this.productshop = this.productshop?.filter(item => item.id !== productID)
      localStorage.setItem('cart', JSON.stringify(this.productshop))
    }*/
  }

  goToCheckout() {
    localStorage.setItem('cart', JSON.stringify(this.productshop))
    if (this.isLoggedIn) {
      this.dialogRef.close()
      this.router.navigate(['/payment'])
    } else {
      this.alertTopic = 'Inicia sesión o regístrate'
      this.alertMessage = 'Por favor inicia sesión o regístrate para continuar con tu compra.'
      this.alertType = 'error'
      this.alertComponent.resetAlert()
      this.dialogRef.close()
      this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
      this.router.navigate(['/login'])
    }
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
