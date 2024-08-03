import { Component } from '@angular/core'
import { CreateOrderData, loadScript, OnApproveData, OnClickActions } from '@paypal/paypal-js'
import { PaymentService } from '../../services/payment.service'
import { CartItem } from '../../interfaces/cartItem'
import { Capture } from '../../interfaces/paypal-types'
import { Router } from '@angular/router'
import { OrderService } from '../../services/order.service'
import { Item } from '../../interfaces/order'

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css',
})
export class PaymentGatewayComponent {
  public productshop?: CartItem[]
  public IVA = 0.12
  isLoading: boolean = false

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private orderService: OrderService,
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

  getCartFromLocalStorage(): unknown {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : {}
  }

  completeTransaction(transaction: Capture) {
    this.saveOrder()

    alert(`Transaction ${transaction.status}: ${transaction.id}`)
    localStorage.setItem('cart', JSON.stringify([]))
    this.router.navigate([''])
  }

  saveOrder() {
    const itemsToBuy: Item[] = this.productshop!.map(cartItem => ({
      product: cartItem.id,
      quantity: cartItem.quantityToBuy,
    }))

    const orderData = {
      client: 1,
      total: this.getCartTotal(),
      status: '4',
      items: itemsToBuy,
    }

    this.orderService.createOrder(orderData).subscribe(response => {
      console.log('Order created:', response)
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
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este artículo del carrito?')
    if (confirmation) {
      this.productshop = this.productshop?.filter(item => item.id !== productID)
      localStorage.setItem('cart', JSON.stringify(this.productshop))
    }
  }
}
