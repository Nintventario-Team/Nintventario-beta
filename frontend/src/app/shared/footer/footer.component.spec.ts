import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have social media links', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.social-icons a')).not.toBeNull();
  });

  it('should have footer navigation links', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.footer-text nav a')).not.toBeNull();
  });
});
