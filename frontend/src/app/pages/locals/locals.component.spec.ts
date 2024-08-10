import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalsComponent } from './locals.component';

describe('LocalsComponent', () => {
  let component: LocalsComponent;
  let fixture: ComponentFixture<LocalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocalsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display store locations', () => {
    component.stores = [
      { name: 'RIOCENTRO CEIBOS', address: 'AV. DEL BOMBERO, KM. 7, VÍA A LA COSTA' },
      { name: 'RIOCENTRO ENTRE RÍOS', address: 'AV. SAMBORONDÓN, SAMBORONDÓN' },
    ];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.store').length).toBe(2);
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
