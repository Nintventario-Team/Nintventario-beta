import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginResponse, User } from '../interfaces/user';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should successfully log in the user', () => {
      const mockLoginResponse: LoginResponse = {
        refresh: 'refresh-token',
        access: 'access-token',
        message: 'Login successful'
      };
      const email = 'user@example.com';
      const password = 'password';

      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(service.loginUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockLoginResponse);

      expect(service.isLoggedInSubject.value).toBe(true);
    });
  });

  describe('register', () => {
    it('should successfully register the user', () => {
      const mockRegisterResponse: LoginResponse = {
        refresh: 'refresh-token',
        access: 'access-token',
        message: 'Registration successful'
      };
      const email = 'user@example.com';
      const password = 'password';
      const first_name = 'John';
      const last_name = 'Doe';

      service.register(email, password, first_name, last_name).subscribe((response) => {
        expect(response).toEqual(mockRegisterResponse);
      });

      const req = httpMock.expectOne(service.registerUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email, password, first_name, last_name });
      req.flush(mockRegisterResponse);
    });
  });

  describe('logout', () => {
    it('should log out the user', () => {
      localStorage.setItem('accessToken', 'access-token'); // Mock the accessToken in localStorage
      service.logout().subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(service.logoutUrl);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(service.isLoggedInSubject.value).toBe(false);
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('checkLoginStatus', () => {
    it('should return true if the user is logged in', () => {
      localStorage.setItem('accessToken', 'access-token'); // Mock the accessToken in localStorage
      expect(service.checkLoginStatus()).toBe(true);
    });

    it('should return false if the user is not logged in', () => {
      expect(service.checkLoginStatus()).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    it('should retrieve user information', () => {
      const mockUser: User = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      };

      localStorage.setItem('accessToken', 'access-token'); // Mock the accessToken in localStorage
      service.getUserInfo().subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(service.userInfoUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
      req.flush(mockUser);
    });
  });

  describe('BehaviorSubject and Observables', () => {
    it('should emit the correct initial login status based on localStorage', () => {
      // Mocking a scenario where accessToken is present in localStorage
      localStorage.setItem('accessToken', 'access-token');
  
      const serviceWithMockedLocalStorage = TestBed.inject(AuthService);
      expect(serviceWithMockedLocalStorage.isLoggedInSubject.value).toBe(true);
  
      // Clearing localStorage and testing the service's initial state
      localStorage.removeItem('accessToken');
      const serviceWithoutLocalStorage = new AuthService(TestBed.inject(HttpClient)); // Inject HttpClient directly
      expect(serviceWithoutLocalStorage.isLoggedInSubject.value).toBe(false);
    });
  });
  
});
