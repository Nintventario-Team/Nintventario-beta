import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing'
import { IndexComponent } from './index.component'
import { ProductService } from '../../services/product.service'
import { Product } from '../../interfaces/product'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Router } from '@angular/router'

describe('IndexComponent', () => {
  let component: IndexComponent
  let fixture: ComponentFixture<IndexComponent>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let productService: jasmine.SpyObj<ProductService>
  let router: Router

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getNewestProducts', 'getBestsellingProducts'])

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, IndexComponent, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 1 } } },
        },
      ],
    }).compileComponents()

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>
    fixture = TestBed.createComponent(IndexComponent)
    component = fixture.componentInstance
    router = TestBed.inject(Router)
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should open and close product details', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 10,
      quantity: 100,
      date_added: new Date(),
      catefory_id: 1,
      local: 'Local 1',
      image: 'image1.jpg',
      details: 'Details 1',
    }

    component.openDetails(mockProduct)

    expect(component.showDetails).toBeTrue()
    expect(component.selectedProduct).toEqual(mockProduct)

    component.closeDetails()

    expect(component.showDetails).toBeFalse()
    expect(component.selectedProduct).toBeUndefined()
  })

  it('should add product to cart', () => {
    const mockProduct: Product = {
      id: 1,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      quantity: 10,
      date_added: new Date(),
      catefory_id: 1,
      local: 'Local 1',
      image: 'image1.jpg',
      details: 'Details 1',
    }
    component.selectedProduct = mockProduct

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]))
    const setItemSpy = spyOn(localStorage, 'setItem').and.callThrough()

    component.addCart()

    expect(setItemSpy).toHaveBeenCalledWith(
      'cart',
      JSON.stringify([
        {
          id: mockProduct.id,
          name: mockProduct.name,
          price: mockProduct.price,
          maxQuantity: mockProduct.quantity,
          quantityToBuy: 1,
          details: mockProduct.details,
          image: mockProduct.image,
        },
      ]),
    )
  })
  it('should search product when Enter key is pressed', fakeAsync(() => {
    const inputValue = 'test product'
    const trimmedValue = inputValue.trim()
    component.inputValue = inputValue

    spyOn(router, 'navigate')

    const event = new KeyboardEvent('keyup', { code: 'Enter' })
    component.searchProduct(event)

    tick()

    expect(router.navigate).toHaveBeenCalledWith(['/todos'], {
      queryParams: { q: trimmedValue },
    })
  }))
})
