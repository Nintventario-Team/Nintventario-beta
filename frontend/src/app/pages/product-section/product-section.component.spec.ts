import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { ProductSectionComponent } from './product-section.component'
import { ActivatedRoute } from '@angular/router'
import { ProductService } from '../../services/product.service'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination'
import { of } from 'rxjs'
import { Product } from '../../interfaces/product'

describe('ProductSectionComponent', () => {
  let component: ProductSectionComponent
  let fixture: ComponentFixture<ProductSectionComponent>
  let productService: jasmine.SpyObj<ProductService>

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getFilteredProducts'])
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, NgxPaginationModule, ProductSectionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ section: 'todos' }),
            queryParams: of({ q: '' }),
          },
        },
        { provide: ProductService, useValue: productServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductSectionComponent)
    component = fixture.componentInstance
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize with section "todos" and fetch products', fakeAsync(() => {
    const mockProducts: Product[] = [
      {
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
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        quantity: 5,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local 2',
        image: 'image2.jpg',
        details: 'Details 2',
      },
    ]
    productService.getFilteredProducts.and.returnValue(of(mockProducts))

    fixture.detectChanges()
    tick()

    expect(component.section).toEqual('todos')
    expect(component.totalProducts).toEqual(mockProducts)
    expect(component.data).toEqual(mockProducts)
  }))

  it('should filter products by search string', () => {
    const mockProducts: Product[] = [
      {
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
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        quantity: 5,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local 2',
        image: 'image2.jpg',
        details: 'Details 2',
      },
    ]
    component.totalProducts = mockProducts

    component.searching = 'product 1'
    component.search()

    expect(component.data.length).toEqual(1)
    expect(component.data[0].name).toEqual('Product 1')
  })

  it('should update price range and fetch filtered products', fakeAsync(() => {
    const mockProducts: Product[] = [
      {
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
      },
    ]
    productService.getFilteredProducts.and.returnValue(of(mockProducts))

    component.minPrice = 0
    component.maxPrice = 200
    component.getFilteredData()
    tick()

    expect(component.data).toEqual(mockProducts)
  }))

  it('should sort products in descending order by price', () => {
    const mockProducts: Product[] = [
      {
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
      },
      {
        id: 2,
        name: 'Product 2',
        description: 'Description 2',
        price: 200,
        quantity: 5,
        date_added: new Date(),
        catefory_id: 2,
        local: 'Local 2',
        image: 'image2.jpg',
        details: 'Details 2',
      },
    ]
    component.totalProducts = mockProducts

    component.data = mockProducts.slice()

    component.sortProducts('desc')

    expect(component.data[0].price).toBeGreaterThan(component.data[1].price)
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
})
