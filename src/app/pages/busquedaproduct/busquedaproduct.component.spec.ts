import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaproductComponent } from './busquedaproduct.component';

describe('BusquedaproductComponent', () => {
  let component: BusquedaproductComponent;
  let fixture: ComponentFixture<BusquedaproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaproductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusquedaproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
