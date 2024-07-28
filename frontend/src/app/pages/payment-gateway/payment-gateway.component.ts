import { Component } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';


@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [],
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
  constructor() { }

  ngOnInit(): void {
    this.loadPayPalScript();
  }

  loadPayPalScript() {
    loadScript({ clientId: "test" })
    .then((paypal) => {
        paypal!
            .Buttons!( )
            .render("#paypal-button-container")
            .catch((error) => {
                console.error("failed to render the PayPal Buttons", error);
            });
    })
    .catch((error) => {
        console.error("failed to load the PayPal JS SDK script", error);
    });
  }
}
