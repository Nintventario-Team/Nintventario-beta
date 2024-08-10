import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistModalComponent } from './wishlist-modal.component';

describe('WishlistModalComponent', () => {
  let component: WishlistModalComponent;
  let fixture: ComponentFixture<WishlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishlistModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display products in wishlist', () => {
    component.data = { products: [{ name: 'Product 1', image: 'image1.jpg', description: 'Description', price: 100 }] };
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.wishlist-item')).not.toBeNull();
  });

  it('should call onClose when close button is clicked', () => {
    spyOn(component, 'onClose');
    const closeButton = fixture.debugElement.nativeElement.querySelector('.wishlist-header img');
    closeButton.click();
    expect(component.onClose).toHaveBeenCalled();
  });
});
