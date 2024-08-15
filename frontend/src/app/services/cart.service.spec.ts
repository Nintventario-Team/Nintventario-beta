import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CartItem } from '../interfaces/cartItem';

describe('CartService', () => {
  let service: CartService;

  const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string): string | null => store[key] || null,
      setItem: (key: string, value: string) => store[key] = value,
      clear: () => store = {},
      removeItem: (key: string) => delete store[key],
    };
  })();

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    mockLocalStorage.clear();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new item to the cart', () => {
    const item: CartItem = {
      id: 1,
      name: 'New Product',
      price: 50,
      maxQuantity: 10,
      quantityToBuy: 1,
      details: 'New details',
      image: 'new-image-url',
    };
    service.addToCart(item);
    expect(service['cartItems'].length).toBe(1);
    expect(service['cartItems'][0]).toEqual(item);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(service['cartItems']));
  });

  it('should update the quantity of an existing item in the cart', () => {
    const item: CartItem = {
      id: 1,
      name: 'Existing Product',
      price: 100,
      maxQuantity: 5,
      quantityToBuy: 1,
      details: 'Existing details',
      image: 'existing-image-url',
    };
    service.addToCart(item);

    const newItem: CartItem = {
      id: 1,
      name: 'Existing Product',
      price: 100,
      maxQuantity: 5,
      quantityToBuy: 1,
      details: 'Existing details',
      image: 'existing-image-url',
    };
    service.addToCart(newItem);

    expect(service['cartItems'].length).toBe(1);
    expect(service['cartItems'][0].quantityToBuy).toBe(2);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(service['cartItems']));
  });

  it('should remove an item from the cart', () => {
    const item: CartItem = {
      id: 1,
      name: 'Product to Remove',
      price: 100,
      maxQuantity: 5,
      quantityToBuy: 1,
      details: 'Details to remove',
      image: 'remove-image-url',
    };
    service.addToCart(item);
    service.removeFromCart(item.id);
    expect(service['cartItems'].length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });

  it('should reset the cart', () => {
    const item: CartItem = {
      id: 1,
      name: 'Product to Reset',
      price: 100,
      maxQuantity: 5,
      quantityToBuy: 1,
      details: 'Details to reset',
      image: 'reset-image-url',
    };
    service.addToCart(item);
    service.resetCart();
    expect(service['cartItems'].length).toBe(0);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([]));
  });

  it('should update the total products in the cart', () => {
    const item: CartItem = {
      id: 1,
      name: 'Product to Update',
      price: 100,
      maxQuantity: 5,
      quantityToBuy: 2,
      details: 'Details to update',
      image: 'update-image-url',
    };
    service.addToCart(item);
    const total = service.totalProducts$;
    total.subscribe(value => {
      expect(value).toBe(2);
    });
  });
});
