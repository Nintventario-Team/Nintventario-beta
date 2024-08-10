import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in the user', () => {
    const mockResponse = { token: '12345' };
    service.login('user@example.com', 'password').subscribe((response) => {
      expect(response.token).toEqual('12345');
    });
    
    const req = httpMock.expectOne('https://your-api-endpoint/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // Add more tests for other service methods
});
