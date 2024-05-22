import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunkosComponent } from './funkos.component';

describe('FunkosComponent', () => {
  let component: FunkosComponent;
  let fixture: ComponentFixture<FunkosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FunkosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FunkosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
