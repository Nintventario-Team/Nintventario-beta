import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './contact.component';
import { ContactService } from '../../services/contact.service'
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule,ContactComponent,HttpClientTestingModule],      providers: [ContactService], 

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with required fields', () => {
    const formElement = fixture.debugElement.nativeElement.querySelector('form');
    expect(formElement).not.toBeNull();
    expect(formElement.querySelectorAll('input[required]').length).toBeGreaterThan(0);
  });

  it('should submit the form', () => {
    spyOn(component, 'onSubmit');
    const button = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    button.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
