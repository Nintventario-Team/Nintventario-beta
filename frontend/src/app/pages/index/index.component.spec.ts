import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IndexComponent } from './index.component';
import { ProductService } from '../../services/product.service'
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IndexComponent,
        FormsModule,
        HttpClientTestingModule 

      ],
      providers: [ProductService], 
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display carousel images', () => {
    component.images = ['image1.png', 'image2.png'];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.carousel-item').length).toBe(2);
  });

  it('should call nextSlide when next button is clicked', () => {
    spyOn(component, 'nextSlide');
    const button = fixture.debugElement.nativeElement.querySelector('.next');
    button.click();
    expect(component.nextSlide).toHaveBeenCalled();
  });

  it('should call prevSlide when prev button is clicked', () => {
    spyOn(component, 'prevSlide');
    const button = fixture.debugElement.nativeElement.querySelector('.prev');
    button.click();
    expect(component.prevSlide).toHaveBeenCalled();
  });
});
