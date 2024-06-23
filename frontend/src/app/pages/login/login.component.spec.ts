import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { LoginResponse, User } from '../../interfaces/user';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, CommonModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: Router,
          useClass: class {
            navigateByUrl = jasmine.createSpy('navigateByUrl');
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register page', () => {
    component.navigateToRegister();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/register');
  });

  it('should login successfully', fakeAsync(() => {
    const mockResponse: LoginResponse = {
      access: 'mockAccessToken',
      refresh: 'mockRefreshToken',
      message: 'Login successful',
    };
    authService.login.and.returnValue(of(mockResponse));

    component.email = 'test@example.com';
    component.password = 'password';
    component.onSubmit();
    tick();

    expect(localStorage.getItem('accessToken')).toEqual(mockResponse.access);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  }));

  it('should handle login error', fakeAsync(() => {
    const errorMessage = 'Invalid credentials';
    authService.login.and.returnValue(throwError(errorMessage));

    const consoleSpy = spyOn(console, 'error');

    component.email = 'invalid@example.com';
    component.password = 'wrongpassword';
    component.onSubmit();
    tick();

    expect(component.errorMessage).toEqual('Invalid credentials');
    expect(consoleSpy).toHaveBeenCalledWith('Login error', errorMessage);
  }));

  it('should not navigate on error', fakeAsync(() => {
    authService.login.and.returnValue(throwError('Invalid credentials'));

    component.email = 'invalid@example.com';
    component.password = 'wrongpassword';
    component.onSubmit();
    tick();

    expect(router.navigateByUrl).not.toHaveBeenCalled();
  }));
});
