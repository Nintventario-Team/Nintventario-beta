import { Component } from '@angular/core';
import { CreateOrderData, loadScript, OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import {PaymentService} from '../../services/payment.service'
import { CartItem } from '../../interfaces/cartItem';
//import {PayPalOrder} from '../../interfaces/paypal-types'


@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.loadPayPalScript();
  }
  loadPayPalScript() {
    loadScript({ clientId: "test" }).then(paypal => {
      paypal!.Buttons!({
        createOrder: (data: CreateOrderData) => {
          const cart = this.getCartFromLocalStorage();
          console.log(data);

          return this.paymentService.createOrder(cart as CartItem).toPromise()
            .then(response => {
              console.log(response);
              console.log(data);
              
              return response!.id;
            });
        },
        onApprove: (data: OnApproveData, actions: OnApproveActions) => {
          console.log("paypal data:",data);
          
          return this.paymentService.captureOrder(data.orderID).toPromise()
            .then(orderData => {
              console.log("orderData paypal response:",orderData);
              
              
              const errorDetail = orderData!.details?.[0];
              
              if (errorDetail) {
                if (errorDetail.issue === "INSTRUMENT_DECLINED") {
                  return actions.restart();
                } else {
                  throw new Error(`${errorDetail.description} (${orderData?.debug_id})`);
                }
              }
              
              const transaction = 
                orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
                orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
                
              if (transaction) {
                alert(`Transaction ${transaction.status}: ${transaction.id}`);
                console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
              } else {
                throw new Error("Transaction not found in order data");
              }
            })
            .catch(error => {
              console.error(error);
              alert(`Sorry, your transaction could not be processed...<br><br>${error}`);
            });
        }
      }).render('#paypal-button-container');
    }).catch(err => {
      console.error('Failed to load the PayPal JS SDK script', err);
    });
  }

  getCartFromLocalStorage(): unknown {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : {};
  }
}
