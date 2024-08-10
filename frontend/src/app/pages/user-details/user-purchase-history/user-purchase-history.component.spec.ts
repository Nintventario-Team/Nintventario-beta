import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserPurchaseHistoryComponent } from './user-purchase-history.component'
import { OrderResponse, Item } from '../../../interfaces/order' // Assuming 'order.ts' defines the OrderResponse and Item interfaces
import { Product } from '../../../interfaces/product' // Assuming 'product.ts' defines the Product interface
import { OrderService } from '../../../services/order.service'
import { ProductService } from '../../../services/product.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
describe('UserPurchaseHistoryComponent', () => {
  let component: UserPurchaseHistoryComponent
  let fixture: ComponentFixture<UserPurchaseHistoryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPurchaseHistoryComponent, HttpClientTestingModule],
      providers: [ProductService, OrderService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPurchaseHistoryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display order list', () => {
    // Mock data matching the OrderResponse interface
    component.orders = [
      {
        id: 1,
        client: 123,
        total: 100,
        status: 'completed',
        date_created: '2024-01-01',
        date_update: '2024-01-02',
        items: [
          {
            product: 1,
            quantity: 2,
          } as Item,
        ],
      },
    ] as OrderResponse[]

    // Mock data matching the Product interface
    component.products = [
      {
        id: 1,
        name: 'Product 1',
        image: 'product.jpg',
        description: 'Product Description',
        details: 'Details',
        local: 'Store',
        price: 50,
      },
    ] as Product[]

    fixture.detectChanges()

    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('.order-accordion-item')).not.toBeNull()
  })
})
