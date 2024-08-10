import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartModalComponent } from './shopping-cart-modal.component';

describe('ShoppingCartModalComponent', () => {
  let component: ShoppingCartModalComponent;
  let fixture: ComponentFixture<ShoppingCartModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartModalComponent]
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
    component.displayedProducts = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', quantityToBuy: 1, price: 100 }
    ];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.cart-item')).not.toBeNull();
  });

  it('should calculate cart subtotal', () => {
    component.displayedProducts = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', quantityToBuy: 1, price: 100 },
      { id: 2, name: 'Product 2', image: 'image2.jpg', quantityToBuy: 2, price: 50 }
    ];
    expect(component.getCartSubtotal()).toBe(200);
  });

  it('should call goToCheckout when checkout button is clicked', () => {
    spyOn(component, 'goToCheckout');
    const checkoutButton = fixture.debugElement.nativeElement.querySelector('.cart-actions button:first-child');
    checkoutButton.click();
    expect(component.goToCheckout).toHaveBeenCalled();
  });
});
