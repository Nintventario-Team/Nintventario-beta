import { Component, ViewChild } from '@angular/core'
import { CreateOrderData, loadScript, OnApproveData, OnClickActions } from '@paypal/paypal-js'
import { PaymentService } from '../../services/payment.service'
import { CartItem } from '../../interfaces/cartItem'
import { Capture } from '../../interfaces/paypal-types'
import { Router } from '@angular/router'
import { OrderService } from '../../services/order.service'
import { Item } from '../../interfaces/order'
import { AuthService } from '../../services/auth.service'
import { User } from '../../interfaces/user'
import { CartService } from '../../services/cart.service'
import { ContactService } from '../../services/contact.service'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [AlertComponent, CommonModule],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css',
})
export class PaymentGatewayComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  public productshop?: CartItem[]
  public IVA = 0.12
  isLoading: boolean = false
  user: User | null = null
  isLoggedIn: boolean = false
  first_name = ''
  last_name = ''
  email = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[] = []
  total = 0
  subtotal = 0
  iva = 0
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''
  selectedLocation: string = ''
  isLocationInvalid: boolean = false

  constructor(
    private router: Router,
    private alertService: AlertService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService,
    private contactService: ContactService, // Inyectar ContactService
  ) {}

  ngOnInit(): void {
    const cartItem = localStorage.getItem('cart')
    if (cartItem !== null) {
      try {
        this.productshop = JSON.parse(cartItem)
      } catch (e) {
        console.error('Error parsing cart data:', e)
      }
    } else {
      this.productshop = []
    }

    this.loadPayPalScript()

    this.isLoggedIn = this.authService.checkLoginStatus()
    if (this.authService.checkLoginStatus()) {
      this.authService.getUserInfo().subscribe(
        (data: User) => {
          this.user = data
          this.first_name = this.user.first_name
          this.last_name = this.user.last_name
          this.email = this.user.email
          console.log(this.user)
          console.log('sddsdsd ', this.first_name)
        },
        (error: unknown) => {
          console.error('Error fetching user info:', error)
        },
      )
    } else {
      console.error('User not authenticated')
    }
    this.authService.isLoggedIn$.subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn))
  }

  loadPayPalScript() {
    loadScript({ clientId: 'test', locale: 'es_EC', buyerCountry: 'EC' })
      .then(paypal => {
        paypal!.Buttons!({
          style: {
            layout: 'vertical',
            disableMaxWidth: true,
            shape: 'rect',
          },
          createOrder: (data: CreateOrderData) => {
            const cart = this.getCartFromLocalStorage()
            console.log(data)

            return this.paymentService
              .createOrder(cart as CartItem)
              .toPromise()
              .then(response => {
                console.log(response)
                console.log(data)

                return response!.id
              })
              .finally(() => this.hideLoading())
          },
          onApprove: (data: OnApproveData) => {
            console.log('paypal data:', data)

            return this.paymentService
              .captureOrder(data.orderID)
              .toPromise()
              .then(orderData => {
                console.log('orderData paypal response:', orderData)

                const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0]

                if (transaction) {
                  this.completeTransaction(transaction)
                  console.log('Capture result', orderData, JSON.stringify(orderData, null, 2))
                } else {
                  throw new Error('Transaction not found in order data')
                }
              })
              .catch(error => {
                console.error(error)
                alert(`Sorry, your transaction could not be processed...<br><br>${error}`)
              })
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick: (data: any, actions: OnClickActions) => {
            if (data.fundingSource === paypal!.FUNDING!['CARD']) {
              this.showLoading()
            }
            return actions.resolve()
          },
          onError: (err: unknown) => {
            console.error(err)
            this.hideLoading()
          },
        }).render('#paypal-button-container')
      })
      .catch(err => {
        console.error('Failed to load the PayPal JS SDK script', err)
      })
  }

  onLocationChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    this.selectedLocation = selectElement.value
    this.isLocationInvalid = this.selectedLocation === ''
  }

  getCartFromLocalStorage(): unknown {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : {}
  }

  completeTransaction(transaction: Capture) {
    if (!this.selectedLocation) {
      this.isLocationInvalid = true
      return
    }
    this.saveOrder()

    // Enviar correo de confirmación
    this.sendConfirmationEmail()
    this.alertTopic = 'Transacción completada'
    this.alertMessage = `Transaction ${transaction.status}: ${transaction.id}- Retiro en: ${this.selectedLocation}`
    this.alertType = 'verify'
    this.alertComponent.resetAlert()
    this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
    localStorage.setItem('cart', JSON.stringify([]))
    this.cartService.resetCart()
    this.router.navigate([''])
  }

  saveOrder() {
    const itemsToBuy: Item[] = this.productshop!.map(cartItem => ({
      product: cartItem.id,
      quantity: cartItem.quantityToBuy,
    }))
    this.total = this.getCartTotal()
    const orderData = {
      client: this.user!.id,
      total: this.getCartTotal(),
      status: '4',
      items: itemsToBuy,
    }

    this.orderService.createOrder(orderData).subscribe(response => {
      console.log('Order created:', response)
    })
  }

  sendConfirmationEmail() {
    const contactData = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      products: this.productshop!.map(cartItem => ({
        name: cartItem.name,
        quantity: cartItem.quantityToBuy,
        price: cartItem.price,
      })),
      total: this.total,
      subtotal: this.getCartSubtotal(),
      iva: this.getCartIVA(),
      pickup_location: this.selectedLocation,
    }
    this.contactService.sendBuyEmail(contactData).subscribe(response => {
      console.log('Confirmation email sent:', response)
    })

    this.contactService.sendBuyEmailToCompany(contactData).subscribe(response => {
      console.log('Confirmation email sent:', response)
    })
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

  showLoading() {
    this.isLoading = true
  }

  hideLoading() {
    setTimeout(() => {
      this.isLoading = false
    }, 1500)
  }

  deleteCartItem(productID: number) {
    this.alertTopic = 'Artículo eliminado'
    this.alertMessage = '¿Estás seguro de que deseas eliminar este artículo del carrito?'
    this.alertType = 'confirm'
    this.alertComponent.resetAlert()
    /*const confirmation = confirm('¿Estás seguro de que deseas eliminar este artículo del carrito?')
    if (confirmation) {
      this.cartService.removeFromCart(productID)
      this.productshop = this.productshop?.filter(item => item.id !== productID)
    }*/
    const subscription = this.alertComponent.confirmAction.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.cartService.removeFromCart(productID)
        this.productshop = this.productshop?.filter(item => item.id !== productID)
      }
      subscription.unsubscribe()
    })
  }
}
