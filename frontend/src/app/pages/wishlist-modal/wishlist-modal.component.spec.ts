import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WishlistModalComponent } from './wishlist-modal.component';
import { WishlistResponse } from '../../interfaces/wishlist'; 
import { AuthService } from '../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WishlistModalComponent', () => {
  let component: WishlistModalComponent;
  let fixture: ComponentFixture<WishlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistModalComponent, HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: MatDialogRef, useValue: {} },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            products: [
              {
                id: 1,
                name: 'Product 1',
                description: 'Description',
                price: 100,
                image: 'image1.jpg',
                added_at: '2024-08-01T00:00:00Z',
              },
            ] as WishlistResponse[],
          },
        },
      ],
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
