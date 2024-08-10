import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WishlistResponse } from '../interfaces/wishlist'; // Assuming 'wishlist.ts' defines the WishlistResponse interface

describe('WishlistService', () => {
  let service: WishlistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WishlistService],
    });
    service = TestBed.inject(WishlistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch wishlist items', () => {
    // Mock data matching the WishlistResponse interface
    const mockWishlist: WishlistResponse[] = [
      {
        id: 1,
        name: 'Product 1',
        description: 'A great product',
        price: 100,
        image: 'image1.jpg',
        added_at: '2024-08-01T00:00:00Z'
      }
    ];

    service.getWishlist().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items).toEqual(mockWishlist);
    });

    const req = httpMock.expectOne('https://nintventario.pythonanywhere.com//wishlist/');
    expect(req.request.method).toBe('GET');
    req.flush(mockWishlist);
  });

});
