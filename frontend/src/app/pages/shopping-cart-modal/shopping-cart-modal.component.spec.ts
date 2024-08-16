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
      imports: [ShoppingCartModalComponent, HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products in cart', () => {
    const mockCartItems = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 1,
        price: 100,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));

    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.cart-item')).not.toBeNull();
  });

  it('should calculate cart subtotal', () => {
    const mockCartItems = [
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
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));

    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(component.getCartSubtotal()).toBe(200);
  });

  it('should call goToCheckout when checkout button is clicked', () => {
    spyOn(component, 'goToCheckout');
    const checkoutButton = fixture.debugElement.nativeElement.querySelector('.cart-actions button:first-child');
    checkoutButton.click();
    expect(component.goToCheckout).toHaveBeenCalled();
  });

  it('should replace underscores with spaces in product names', () => {
    const result = component.replaceUnderscores('Product_Name_With_Underscores');
    expect(result).toBe('Product Name With Underscores');
  });

  it('should calculate the correct subtotal for a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 2,
        price: 50,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const subtotal = component.getSubtotal(1);
    expect(subtotal).toBe(100);
  });

  it('should calculate the correct IVA for a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 2,
        price: 50,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const iva = component.getIVA(1);
    expect(iva).toBeCloseTo(12, 5); // 12% de 100 es 12
  });

  it('should calculate the correct total for a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 2,
        price: 50,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const total = component.getTotal(1);
    expect(total).toBeCloseTo(112, 5); // 100 + 12 = 112
  });

  it('should calculate the correct IVA for the entire cart', () => {
    const mockCartItems: CartItem[] = [
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
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cartIVA = component.getCartIVA();
    expect(cartIVA).toBeCloseTo(24, 5); // 12% de 200 es 24
  });

  it('should calculate the correct total for the entire cart', () => {
    const mockCartItems: CartItem[] = [
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
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cartTotal = component.getCartTotal();
    expect(cartTotal).toBeCloseTo(224, 2); // 200 + 24 = 224
  });

  it('should update the quantity of a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 1,
        price: 100,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  
    const inputElement = document.createElement('input');
    inputElement.value = '5'; 
    const event = new Event('input', { bubbles: true }); 
    Object.defineProperty(event, 'target', { value: inputElement }); 
  
    component.updateQuantity(event, 1);
  
    expect(component.productshop![0].quantityToBuy).toBe(5); 
  });
  

  it('should increase the quantity of a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 1,
        price: 100,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.increaseQuantity(component.productshop![0]);

    expect(component.productshop![0].quantityToBuy).toBe(2);
  });

  it('should decrease the quantity of a product', () => {
    const mockCartItems: CartItem[] = [
      {
        id: 1,
        name: 'Product 1',
        image: 'image1.jpg',
        quantityToBuy: 2,
        price: 100,
        maxQuantity: 10,
        details: 'Details of product 1'
      }
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.decreaseQuantity(component.productshop![0]);

    expect(component.productshop![0].quantityToBuy).toBe(1);
  });

  it('should delete a product from the cart', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const mockCartItems: CartItem[] = [
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
    ];
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    fixture = TestBed.createComponent(ShoppingCartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.deleteCartItem(1);

    expect(component.productshop!.length).toBe(2);
    expect(component.productshop![0].id).toBe(1);
  });


  it('should prevent typing in quantity input', () => {
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
    spyOn(keyboardEvent, 'preventDefault');

    component.preventTyping(keyboardEvent);

    expect(keyboardEvent.preventDefault).toHaveBeenCalled();
  });

});
