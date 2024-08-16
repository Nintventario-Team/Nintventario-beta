/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSectionComponent } from './product-section.component';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../interfaces/product';
import { WishlistResponse } from '../../interfaces/wishlist';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductSectionComponent', () => {
  let component: ProductSectionComponent;
  let fixture: ComponentFixture<ProductSectionComponent>;

  let productServiceMock: any;
  let authServiceMock: any;
  let wishlistServiceMock: any;
  let cartServiceMock: any;
  let activatedRouteMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getNewestProducts: jasmine.createSpy('getNewestProducts').and.returnValue(of([])),
      getBestsellingProducts: jasmine.createSpy('getBestsellingProducts').and.returnValue(of([])),
      getFilteredProducts: jasmine.createSpy('getFilteredProducts').and.returnValue(of([])),
    };

    authServiceMock = {
      checkLoginStatus: jasmine.createSpy('checkLoginStatus').and.returnValue(true),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue(of({ id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' })),
      isLoggedIn$: of(true),
    };

    wishlistServiceMock = {
      addToWishlist: jasmine.createSpy('addToWishlist').and.returnValue(of({})),
      removeFromWishlist: jasmine.createSpy('removeFromWishlist').and.returnValue(of({})),
      getWishlist: jasmine.createSpy('getWishlist').and.returnValue(of([])),
    };

    cartServiceMock = {
      addToCart: jasmine.createSpy('addToCart').and.callThrough(),
    };

    activatedRouteMock = {
      data: of({ section: 'videojuegos' }),
      queryParams: of({ q: 'search-term' }),
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      imports: [ProductSectionComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: WishlistService, useValue: wishlistServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize section, fetch user info and wishlist if logged in', () => {
    expect(component.section).toBe('videojuegos');
    expect(authServiceMock.checkLoginStatus).toHaveBeenCalled();
    expect(authServiceMock.getUserInfo).toHaveBeenCalled();
    expect(wishlistServiceMock.getWishlist).toHaveBeenCalled();
  });

  it('should fetch products based on section', () => {
    component.getFilteredData();

    expect(productServiceMock.getFilteredProducts).toHaveBeenCalled();
    expect(productServiceMock.getFilteredProducts).toHaveBeenCalledWith(component.minPrice, component.maxPrice, 'jue', component.category);
  });

  it('should sort products by price asc', () => {
    component.data = [
      { id: 1, name: 'Product 1', price: 100 } as Product,
      { id: 2, name: 'Product 2', price: 50 } as Product,
    ];
    component.sortProductsFilter('asc');
    expect(component.data[0].price).toBe(50);
    expect(component.data[1].price).toBe(100);
  });

  it('should add product to wishlist', () => {
    const product = { id: 1, name: 'Product 1' } as Product;
    component.addWishlist(product);
    expect(wishlistServiceMock.addToWishlist).toHaveBeenCalledWith(1);
  });

  it('should remove product from wishlist', () => {
    const product = { id: 1, name: 'Product 1' } as Product;
    component.wishlist = [{ id: 1, name: 'Product 1', description: '', price: 100, image: '', added_at: '' } as WishlistResponse];
    component.removeWishlist(product);
    expect(wishlistServiceMock.removeFromWishlist).toHaveBeenCalledWith(1);
  });

  it('should add product to cart', () => {
    const product = { id: 1, name: 'Product 1', price: 100, quantity: 10, details: '', image: '' } as Product;
    spyOn(localStorage, 'setItem');
    component.addCart(new MouseEvent('click'), product);
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({
      id: 1,
      name: 'Product 1',
      price: 100,
      maxQuantity: 10,
      quantityToBuy: 1,
      details: '',
      image: ''
    });
  });

  it('should navigate when search icon is clicked', () => {
    component.inputValue = 'search term';
    component.searchIcon();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videojuegos'], { queryParams: { q: 'search term' } });
  });

  it('should navigate when Enter key is pressed in search', () => {
    component.inputValue = 'search term';
    const event = new KeyboardEvent('keydown', { code: 'Enter' });
    component.searchProduct(event);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/videojuegos'], { queryParams: { q: 'search term' } });
  });

  it('should validate wishlist addition or removal based on login status', () => {
    const product = { id: 1, name: 'Product 1' } as Product;
    component.isLoggedIn = true;
  
    const isProductInWishlistSpy = spyOn(component, 'isProductInWishlist').and.returnValue(false);
  
    component.validateWishlist(new MouseEvent('click'), product);
    expect(wishlistServiceMock.addToWishlist).toHaveBeenCalledWith(1);
  
    isProductInWishlistSpy.and.returnValue(true);
    component.validateWishlist(new MouseEvent('click'), product);
    expect(wishlistServiceMock.removeFromWishlist).toHaveBeenCalledWith(1);
  });
  

  
  it('should filter by genre and platform', () => {
    spyOn(component, 'getFilteredData');

    component.filterByGenreAndPlatform('PS5', 'Acción');
    expect(component.selectedPlatform).toBe('PS5');
    expect(component.selectedGenre).toBe('Acción');
    expect(component.getFilteredData).toHaveBeenCalled();
  });

});
