import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AlertService } from '../../services/alert.service';
import { EmailChangeConfirmationComponent } from './email-change-confirmation.component';

describe('EmailChangeConfirmationComponent', () => {
  let component: EmailChangeConfirmationComponent;
  let fixture: ComponentFixture<EmailChangeConfirmationComponent>;
  let authServiceMock: any;
  let alertServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      requestPasswordReset: jasmine.createSpy('requestPasswordReset').and.returnValue(of({})),
    };

    alertServiceMock = {
      showAlert: false,
      alertTopic: '',
      alertMessage: '',
      alertType: 'verify',
      setAlert: jasmine.createSpy('setAlert'),
      clearAlert: jasmine.createSpy('clearAlert'),
    };

    routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, AlertComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailChangeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize alert properties if alert is active', () => {
    alertServiceMock.showAlert = true;
    alertServiceMock.alertTopic = 'Test Topic';
    alertServiceMock.alertMessage = 'Test Message';
    alertServiceMock.alertType = 'confirm';

    component.ngOnInit();

    expect(component.alertTopic).toBe('Test Topic');
    expect(component.alertMessage).toBe('Test Message');
    expect(component.alertType).toBe('confirm');
    expect(component.showAlert).toBeTrue();
    expect(alertServiceMock.clearAlert).toHaveBeenCalled();
  });

  it('should navigate to login when navigateToLogin is called', () => {
    component.navigateToLogin();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});

