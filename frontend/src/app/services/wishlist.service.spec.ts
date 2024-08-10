import { TestBed } from '@angular/core/testing';
import { WishlistService } from './wishlist.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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
    const mockWishlist = [{ id: 1, name: 'Product 1' }];
    service.getWishlist().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items).toEqual(mockWishlist);
    });

    const req = httpMock.expectOne('https://your-api-endpoint/wishlist');
    expect(req.request.method).toBe('GET');
    req.flush(mockWishlist);
  });

  // Add more tests for other service methods
});
