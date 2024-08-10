import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should place an order', () => {
    const mockOrder = { orderId: 12345 };
    service.placeOrder({}).subscribe((response) => {
      expect(response.orderId).toEqual(12345);
    });

    const req = httpMock.expectOne('https://your-api-endpoint/orders');
    expect(req.request.method).toBe('POST');
    req.flush(mockOrder);
  });

  // Add more tests for other service methods
});
