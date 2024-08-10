import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentGatewayComponent } from './payment-gateway.component';
import { PaymentService } from '../../services/payment.service';
import { of } from 'rxjs';
import { CartItem } from '../../interfaces/cartItem'; 
import { AuthService } from '../../services/auth.service'
import { OrderService } from '../../services/order.service'
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PaymentGatewayComponent', () => {
  let component: PaymentGatewayComponent;
  let fixture: ComponentFixture<PaymentGatewayComponent>;
  let paymentServiceMock: any;

  beforeEach(async () => {
    paymentServiceMock = {
      processPayment: jasmine.createSpy('processPayment').and.returnValue(of({ status: 'success' }))
    };

    await TestBed.configureTestingModule({
      imports: [PaymentGatewayComponent,HttpClientTestingModule],
      providers: [OrderService,AuthService,
        { provide: PaymentService, useValue: paymentServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products in cart', () => {
    // Mock data matching the CartItem interface
    component.productshop = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', quantityToBuy: 1, price: 100, maxQuantity: 10, details: 'Details of product 1' }
    ] as CartItem[];
    
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.cart-item')).not.toBeNull();
  });

  it('should calculate cart subtotal', () => {
    component.productshop = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', quantityToBuy: 1, price: 100, maxQuantity: 10, details: 'Details of product 1' },
      { id: 2, name: 'Product 2', image: 'image2.jpg', quantityToBuy: 2, price: 50, maxQuantity: 5, details: 'Details of product 2' }
    ] as CartItem[];
    
    expect(component.getCartSubtotal()).toBe(200);
  });

  it('should call deleteCartItem when delete button is clicked', () => {
    spyOn(component, 'deleteCartItem');
    component.productshop = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', quantityToBuy: 1, price: 100, maxQuantity: 10, details: 'Details of product 1' }
    ] as CartItem[];
    
    fixture.detectChanges();
    const deleteButton = fixture.debugElement.nativeElement.querySelector('.delete-btn');
    deleteButton.click();
    expect(component.deleteCartItem).toHaveBeenCalledWith(1);
  });
});
