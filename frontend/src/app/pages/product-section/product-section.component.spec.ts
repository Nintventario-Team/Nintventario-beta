import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSectionComponent } from './product-section.component';
import { ProductService } from '../../services/product.service';
import { of } from 'rxjs';

describe('ProductSectionComponent', () => {
  let component: ProductSectionComponent;
  let fixture: ComponentFixture<ProductSectionComponent>;
  let productServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProductsByCategory: jasmine.createSpy('getProductsByCategory').and.returnValue(of([]))
    };

    await TestBed.configureTestingModule({
      declarations: [ProductSectionComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getProductsByCategory on init', () => {
    component.ngOnInit();
    expect(productServiceMock.getProductsByCategory).toHaveBeenCalled();
  });

  it('should display product list', () => {
    component.data = [
      { id: 1, name: 'Product 1', image: 'image1.jpg', price: 100 }
    ];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.product-item')).not.toBeNull();
  });

  it('should filter products by genre', () => {
    spyOn(component, 'filterByGenre');
    component.genres = ['Action', 'Adventure'];
    fixture.detectChanges();
    const genreOption = fixture.debugElement.nativeElement.querySelector('.filter-option input');
    genreOption.click();
    expect(component.filterByGenre).toHaveBeenCalled();
  });
});
