import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceMock: any;
  let alertServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['resetPassword']);
    alertServiceMock = jasmine.createSpyObj('AlertService', ['setAlert']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRouteMock = { params: of({ uid: 'test-uid', token: 'test-token' }) };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, AlertComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize uid and token from route params', () => {
    component.ngOnInit();
    expect(component.uid).toBe('test-uid');
    expect(component.token).toBe('test-token');
  });

  it('should show alert and navigate on successful password reset', fakeAsync(() => {
    authServiceMock.resetPassword.and.returnValue(of({}));

    component.resetForm.get('password')?.setValue('ValidPassword');
    component.resetForm.get('confirmPassword')?.setValue('ValidPassword');
    component.onSubmit();

    tick();
    fixture.detectChanges();

    expect(alertServiceMock.setAlert).toHaveBeenCalledWith(
      'Contraseña restablecida',
      'Contraseña restablecida con éxito.',
      'verify'
    );
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

 
});
