import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartItem } from '../interfaces/cartItem';
import { PayPalOrder, PayPalCaptureResponse } from '../interfaces/paypal-types';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService],
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

  describe('createOrder', () => {
    it('should create a new PayPal order', () => {
      const mockCartItem: CartItem = {
        id: 1,
        name: 'Product 1',
        price: 100,
        maxQuantity: 10,
        quantityToBuy: 1,
        details: 'Details of product 1',
        image: 'image1.jpg'
      };

      const mockPayPalOrder: PayPalOrder = {
        id: 'ORDER-ID',
        status: 'CREATED',
        links: [
          {
            href: 'https://api.sandbox.paypal.com/v2/checkout/orders/ORDER-ID',
            rel: 'self',
            method: 'GET'
          },
          {
            href: 'https://www.paypal.com/checkoutnow?token=ORDER-ID',
            rel: 'approve',
            method: 'GET'
          }
        ]
      };

      service.createOrder(mockCartItem).subscribe((response) => {
        expect(response).toEqual(mockPayPalOrder);
      });

      const req = httpMock.expectOne(`${service['backendUrl']}/payments/create-order/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ cart: mockCartItem });
      req.flush(mockPayPalOrder);
    });
  });

  describe('captureOrder', () => {
    it('should capture a PayPal order', () => {
      const orderID = 'ORDER-ID';
      const mockPayPalCaptureResponse: PayPalCaptureResponse = {
        id: 'CAPTURE-ID',
        status: 'COMPLETED',
        payment_source: {
          paypal: {
            email_address: 'payer@example.com',
            account_id: 'PAYER-ID',
            account_status: 'VERIFIED',
            name: {
              given_name: 'John',
              surname: 'Doe'
            },
            address: {
              country_code: 'US'
            }
          }
        },
        purchase_units: [
          {
            reference_id: 'PUHF',
            shipping: {
              name: {
                full_name: 'John Doe'
              },
              address: {
                address_line_1: '1234 Main St',
                admin_area_2: 'San Francisco',
                admin_area_1: 'CA',
                postal_code: '94111',
                country_code: 'US'
              }
            },
            payments: {
              captures: [
                {
                  id: 'CAPTURE-ID',
                  status: 'COMPLETED',
                  amount: {
                    currency_code: 'USD',
                    value: '100.00'
                  },
                  final_capture: true,
                  seller_protection: {
                    status: 'ELIGIBLE',
                    dispute_categories: ['ITEM_NOT_RECEIVED', 'UNAUTHORIZED_TRANSACTION']
                  },
                  seller_receivable_breakdown: {
                    gross_amount: {
                      currency_code: 'USD',
                      value: '100.00'
                    },
                    paypal_fee: {
                      currency_code: 'USD',
                      value: '3.00'
                    },
                    net_amount: {
                      currency_code: 'USD',
                      value: '97.00'
                    }
                  },
                  links: [
                    {
                      href: 'https://api.sandbox.paypal.com/v2/payments/captures/CAPTURE-ID',
                      rel: 'self',
                      method: 'GET'
                    }
                  ],
                  create_time: '2024-08-10T00:00:00Z',
                  update_time: '2024-08-10T00:00:00Z'
                }
              ]
            }
          }
        ],
        payer: {
          name: {
            given_name: 'John',
            surname: 'Doe'
          },
          email_address: 'payer@example.com',
          payer_id: 'PAYER-ID',
          address: {
            country_code: 'US'
          }
        },
        links: [
          {
            href: 'https://api.sandbox.paypal.com/v2/payments/captures/CAPTURE-ID',
            rel: 'self',
            method: 'GET'
          }
        ]
      };

      service.captureOrder(orderID).subscribe((response) => {
        expect(response).toEqual(mockPayPalCaptureResponse);
      });

      const req = httpMock.expectOne(`${service['backendUrl']}/payments/capture-order/${orderID}/`);
      expect(req.request.method).toBe('POST');
      req.flush(mockPayPalCaptureResponse);
    });
  });
});
