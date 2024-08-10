import { TestBed } from '@angular/core/testing';
import { ContactService } from './contact.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send contact email', () => {
    const mockContactData = { name: 'John Doe', email: 'john.doe@example.com', message: 'Hello!' };

    service.sendContactEmail(mockContactData).subscribe((response) => {
      expect(response).toEqual(mockContactData); // Replace with your expected response structure
    });

    const req = httpMock.expectOne('https://nintventario.pythonanywhere.com/send-contact-email/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockContactData);

    req.flush(mockContactData); // Simulate a successful response
  });

  it('should send register email', () => {
    const mockRegisterData = { name: 'Jane Doe', email: 'jane.doe@example.com' };

    service.sendRegisterEmail(mockRegisterData).subscribe((response) => {
      expect(response).toEqual(mockRegisterData); // Replace with your expected response structure
    });

    const req = httpMock.expectOne('https://nintventario.pythonanywhere.com/send-register-email/');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterData);

    req.flush(mockRegisterData); // Simulate a successful response
  });
});
