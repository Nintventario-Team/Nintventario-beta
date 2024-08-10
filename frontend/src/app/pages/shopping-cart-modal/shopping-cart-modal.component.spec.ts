import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartModalComponent } from './shopping-cart-modal.component';
import { AuthService } from '../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { CartItem } from '../../interfaces/cartItem';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ShoppingCartModalComponent', () => {
  let component: ShoppingCartModalComponent;
  let fixture: ComponentFixture<ShoppingCartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingCartModalComponent,HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: MatDialogRef, useValue: {} }, 
        {provide:MAT_DIALOG_DATA,useValue:{}}
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products in cart', () => {
    // Mock data matching the CartItem interface
    component.displayedProducts = [
      { 
        id: 1, 
        name: 'Product 1', 
        image: 'image1.jpg', 
        quantityToBuy: 1, 
        price: 100, 
        maxQuantity: 10, 
        details: 'Details of product 1' 
      }
    ] as CartItem[];
    
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.cart-item')).not.toBeNull();
  });

  it('should calculate cart subtotal', () => {
    component.displayedProducts = [
      { 
        id: 1, 
        name: 'Product 1', 
        image: 'image1.jpg', 
        quantityToBuy: 1, 
        price: 100, 
        maxQuantity: 10, 
        details: 'Details of product 1' 
      },
      { 
        id: 2, 
        name: 'Product 2', 
        image: 'image2.jpg', 
        quantityToBuy: 2, 
        price: 50, 
        maxQuantity: 5, 
        details: 'Details of product 2' 
      }
    ] as CartItem[];
    
    expect(component.getCartSubtotal()).toBe(200);
  });

  it('should call goToCheckout when checkout button is clicked', () => {
    spyOn(component, 'goToCheckout');
    const checkoutButton = fixture.debugElement.nativeElement.querySelector('.cart-actions button:first-child');
    checkoutButton.click();
    expect(component.goToCheckout).toHaveBeenCalled();
  });
});
