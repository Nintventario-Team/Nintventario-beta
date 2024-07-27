import { TestBed, ComponentFixture } from '@angular/core/testing'
import { ShoppingCartModalComponent } from './shopping-cart-modal.component'
import { Router } from '@angular/router'
import { Location } from '@angular/common'

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartModalComponent
  let fixture: ComponentFixture<ShoppingCartModalComponent>
  let router: Router
  let location: Location

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate')
          },
        },
        {
          provide: Location,
          useClass: class {
            back = jasmine.createSpy('back')
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ShoppingCartModalComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should load products from localStorage on init', () => {
    const mockProducts = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
      {
        id: 2,
        name: 'Product B',
        price: 15,
        quantityToBuy: 1,
        maxQuantity: 10,
        details: '',
        image: '',
      },
    ]
    localStorage.setItem('cart', JSON.stringify(mockProducts))

    fixture.detectChanges()

    expect(component.productshop).toEqual(mockProducts)
    expect(component.isCartEmpty).toBeFalse()
  })

  it('should calculate subtotal correctly', () => {
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    const subtotal = component.getSubtotal(1)

    expect(subtotal).toEqual(20) // 10 * 2
  })

  it('should calculate IVA correctly', () => {
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    const iva = component.getIVA(1)

    expect(iva).toEqual(2.4) // 20 * 0.12
  })

  it('should calculate total correctly', () => {
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    const total = component.getTotal(1)

    expect(total).toEqual(22.4) // 20 + 2.40
  })

  it('should update quantity correctly', () => {
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    const event = { target: { value: '3' } } as unknown as Event
    component.updateQuantity(event, 1)

    expect(component.productshop[0].quantityToBuy).toEqual(3)
  })

  it('should navigate to checkout', () => {
    spyOn(localStorage, 'setItem')
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    component.goToCheckout()

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(component.productshop))
    expect(router.navigate).toHaveBeenCalledWith(['/caja'])
  })

  it('should go back to previous location', () => {
    spyOn(localStorage, 'setItem')
    component.productshop = [
      {
        id: 1,
        name: 'Product A',
        price: 10,
        quantityToBuy: 2,
        maxQuantity: 5,
        details: '',
        image: '',
      },
    ]

    component.keepBuying()

    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(component.productshop))
    expect(location.back).toHaveBeenCalled()
  })

  it('should prevent typing', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
    } as unknown as KeyboardEvent

    component.preventTyping(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })
})
