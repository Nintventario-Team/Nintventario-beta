import {
  TestBed,
  ComponentFixture,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'checkLoginStatus',
      'getUserInfo',
      'logout',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set userInfo if user is authenticated', fakeAsync(() => {
      const mockUser: User = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      };
      authService.checkLoginStatus.and.returnValue(true);
      authService.getUserInfo.and.returnValue(of(mockUser));

      fixture.detectChanges();
      tick();

      expect(authService.getUserInfo).toHaveBeenCalled();
      expect(component.userInfo).toEqual(mockUser);
    }));

    it('should log error if user info cannot be fetched', fakeAsync(() => {
      authService.checkLoginStatus.and.returnValue(true);
      authService.getUserInfo.and.returnValue(
        throwError('User info fetch error')
      );

      spyOn(console, 'error');

      fixture.detectChanges();
      tick();

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user info:',
        'User info fetch error'
      );
    }));

    it('should log error if user is not authenticated', () => {
      authService.checkLoginStatus.and.returnValue(false);
      spyOn(console, 'error');

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith('User not authenticated');
    });
  });

  describe('logout', () => {
    it('should logout and navigate to home', () => {
      authService.logout.and.stub();

      component.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    });
  });
});
