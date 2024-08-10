import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process payment', () => {
    const mockPaymentResponse = { status: 'success' };
    service.processPayment({}).subscribe((response) => {
      expect(response.status).toEqual('success');
    });

    const req = httpMock.expectOne('https://your-api-endpoint/payments');
    expect(req.request.method).toBe('POST');
    req.flush(mockPaymentResponse);
  });

  // Add more tests for other service methods
});
