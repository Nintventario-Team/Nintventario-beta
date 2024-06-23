import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../interfaces/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all products from API via GET', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Product A',
        description: 'Description A',
        price: 100,
        quantity: 10,
        date_added: new Date(),
        catefory_id: 1,
        local: 'Local A',
        image: 'image_url',
        details: 'Details A',
      },
      {
        id: 2,
        name: 'Product B',
        description: 'Description B',
        price: 150,
        quantity: 15,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local B',
        image: 'image_url',
        details: 'Details B',
      },
    ];

    service.getAllProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpTestingController.expectOne(
      `${service['backendUrl']}/products/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should retrieve filtered products from API via GET', () => {
    const mockFilteredProducts: Product[] = [
      {
        id: 1,
        name: 'Filtered Product A',
        description: 'Description A',
        price: 120,
        quantity: 5,
        date_added: new Date(),
        catefory_id: 1,
        local: 'Local A',
        image: 'image_url',
        details: 'Details A',
      },
      {
        id: 2,
        name: 'Filtered Product B',
        description: 'Description B',
        price: 180,
        quantity: 8,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local B',
        image: 'image_url',
        details: 'Details B',
      },
    ];

    service.getFilteredProducts(100, 200, 'type').subscribe((products) => {
      expect(products).toEqual(mockFilteredProducts);
    });

    const req = httpTestingController.expectOne(
      `${service['backendUrl']}/filteredProducts/?price_min=100&price_max=200&product_type=type`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFilteredProducts);
  });

  it('should retrieve newest products from API via GET', () => {
    const mockNewestProducts: Product[] = [
      {
        id: 1,
        name: 'Newest Product A',
        description: 'Description A',
        price: 110,
        quantity: 7,
        date_added: new Date(),
        catefory_id: 1,
        local: 'Local A',
        image: 'image_url',
        details: 'Details A',
      },
      {
        id: 2,
        name: 'Newest Product B',
        description: 'Description B',
        price: 160,
        quantity: 12,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local B',
        image: 'image_url',
        details: 'Details B',
      },
    ];

    service.getNewestProducts().subscribe((products) => {
      expect(products).toEqual(mockNewestProducts);
    });

    const req = httpTestingController.expectOne(
      `${service['backendUrl']}/newest-products/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockNewestProducts);
  });

  it('should retrieve bestselling products from API via GET', () => {
    const mockBestsellingProducts: Product[] = [
      {
        id: 1,
        name: 'Bestselling Product A',
        description: 'Description A',
        price: 130,
        quantity: 3,
        date_added: new Date(),
        catefory_id: 1,
        local: 'Local A',
        image: 'image_url',
        details: 'Details A',
      },
      {
        id: 2,
        name: 'Bestselling Product B',
        description: 'Description B',
        price: 140,
        quantity: 6,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local B',
        image: 'image_url',
        details: 'Details B',
      },
    ];

    service.getBestsellingProducts().subscribe((products) => {
      expect(products).toEqual(mockBestsellingProducts);
    });

    const req = httpTestingController.expectOne(
      `${service['backendUrl']}/bestselling-products/`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockBestsellingProducts);
  });
});
