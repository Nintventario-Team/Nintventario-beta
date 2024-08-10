import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPurchaseHistoryComponent } from './user-purchase-history.component';

describe('UserPurchaseHistoryComponent', () => {
  let component: UserPurchaseHistoryComponent;
  let fixture: ComponentFixture<UserPurchaseHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPurchaseHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPurchaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display order list', () => {
    component.orders = [
      { date_created: '2024-01-01', total: 100, items: [{ product: 1 }] }
    ];
    component.products = [{ id: 1, image: 'product.jpg', description: 'Product Description', details: 'Details', local: 'Store', price: 50 }];
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.order-accordion-item')).not.toBeNull();
  });
});
