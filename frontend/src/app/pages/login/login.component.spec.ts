import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of({ token: '12345' }))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl')  // Add spy for navigateByUrl
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule,LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService login method when form is submitted', () => {
    component.email = 'user@example.com';
    component.password = 'password';
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'password');
  });

  it('should navigate to home after successful login', () => {
    component.onSubmit();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/'); 
  });
});
