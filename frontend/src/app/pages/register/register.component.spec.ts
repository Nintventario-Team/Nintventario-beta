import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let contactServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of({ token: '12345' })),
    };

    contactServiceMock = {
      sendRegisterEmail: jasmine.createSpy('sendRegisterEmail').and.returnValue(of({ success: true })),
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ContactService, useValue: contactServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService register method when form is submitted', () => {
    component.contactForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'user@example.com',
      password: 'password123'
    });
    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'user@example.com',
      'password123',
      'John',
      'Doe'
    );
  });

  it('should show error message if email already exists', () => {
    authServiceMock.register.and.returnValue(throwError({ error: { error: 'Email already exists' } }));
    
    component.contactForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'user@example.com',
      password: 'password123'
    });
    component.onSubmit();

    expect(component.alertMessage).toBe('Este correo ya tiene una cuenta registrada');
    expect(component.showAlert).toBe(true);
    expect(component.alertClass).toBe('alert-error');
  });

  it('should show general error message on registration failure', () => {
    authServiceMock.register.and.returnValue(throwError({ error: 'Some error' }));
    
    component.contactForm.setValue({
      first_name: 'John',
      last_name: 'Doe',
      email: 'user@example.com',
      password: 'password123'
    });
    component.onSubmit();

    expect(component.alertMessage).toBe('Ocurrió un error durante el registro');
    expect(component.showAlert).toBe(true);
    expect(component.alertClass).toBe('alert-error');
  });

  it('should show validation error message if form is invalid', () => {
    component.contactForm.setValue({
      first_name: '',
      last_name: '',
      email: 'invalid-email',
      password: '123'
    });
    component.onSubmit();

    expect(component.alertMessage).toBe('Por favor, completa todos los campos correctamente');
    expect(component.showAlert).toBe(true);
    expect(component.alertClass).toBe('alert-error');
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
