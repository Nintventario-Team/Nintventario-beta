import { Component } from '@angular/core'
import { CdkAccordionModule } from '@angular/cdk/accordion'
import { OrderResponse } from '../../../interfaces/order'
import { OrderService } from '../../../services/order.service'
import { ProductService } from '../../../services/product.service'
import { Product } from '../../../interfaces/product'

@Component({
  selector: 'app-user-purchase-history',
  standalone: true,
  imports: [CdkAccordionModule],
  templateUrl: './user-purchase-history.component.html',
  styleUrl: './user-purchase-history.component.css',
})
export class UserPurchaseHistoryComponent {
  expandedIndex = 0
  orders: OrderResponse[] = []
  products:Product[]=[]

  constructor(
    private purchaseHistoryService: OrderService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadPurchaseHistory()
  }

  loadPurchaseHistory(): void {
    this.purchaseHistoryService.getPurchaseHistory().subscribe(
      (data: OrderResponse[]) => {
        this.orders = data
        this.loadProducts()
      },
      (error: any) => {
        console.error('Error loading purchase history', error)
      },
    )
  }
  private loadProducts(): void {
    const productIds = new Set<number>()

    for (const order of this.orders) {
      for (const item of order.items) {
        productIds.add(item.product)
      }
    }

    const productIdsArray = Array.from(productIds)

    productIdsArray.forEach(id => {
      this.productService.getProductById(id).subscribe(
        (product: Product) => {
            this.products.push(product)
          
        },
        (error: any) => {
          console.error(`Error loading product with ID ${id}`, error)
        },
      )
    })
  }
}
