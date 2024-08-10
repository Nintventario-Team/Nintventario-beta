import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Order, OrderResponse } from '../interfaces/order';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpHeaders } from '@angular/common/http';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService],
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createOrder', () => {
    it('should create a new order', () => {
      const mockOrder: Order = {
        client: 1,
        total: 100,
        status: 'pending',
        items: [
          { product: 1, quantity: 2 }
        ]
      };

      const mockOrderResponse: OrderResponse = {
        id: 1,
        client: 1,
        total: 100,
        status: 'pending',
        date_created: '2024-08-10T00:00:00Z',
        date_update: '2024-08-10T00:00:00Z',
        items: [
          { product: 1, quantity: 2 }
        ]
      };

      localStorage.setItem('accessToken', 'access-token'); // Mock the accessToken in localStorage

      service.createOrder(mockOrder).subscribe((response) => {
        expect(response).toEqual(mockOrderResponse);
      });

      const req = httpMock.expectOne(`${service['backendUrl']}/create-order/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockOrder);
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
      req.flush(mockOrderResponse);
    });
  });

  describe('getPurchaseHistory', () => {
    it('should retrieve the purchase history', () => {
      const mockPurchaseHistory: OrderResponse[] = [
        {
          id: 1,
          client: 1,
          total: 100,
          status: 'completed',
          date_created: '2024-08-10T00:00:00Z',
          date_update: '2024-08-11T00:00:00Z',
          items: [
            { product: 1, quantity: 2 }
          ]
        }
      ];

      localStorage.setItem('accessToken', 'access-token'); // Mock the accessToken in localStorage

      service.getPurchaseHistory().subscribe((response) => {
        expect(response).toEqual(mockPurchaseHistory);
      });

      const req = httpMock.expectOne(`${service['backendUrl']}/purchase-history/`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
      req.flush(mockPurchaseHistory);
    });
  });
});
