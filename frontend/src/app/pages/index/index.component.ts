import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductService } from '../../services/product.service'
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router'
import { Product } from '../../interfaces/product'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterModule, FormsModule],
  providers: [ProductService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class IndexComponent {
  public bestSellers: Product[] = []
  public newProducts: Product[] = []
  showDetails: boolean = false
  selectedProduct: Product | undefined
  inputValue: string = ''
  images: string[] = [
    'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fhome%20page%2FbannerC1.jpg?alt=media&token=b3baee00-cc12-4e6c-9b0c-414f37007e26',
    'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fhome%20page%2FbannerC2.jpg?alt=media&token=ca1295fc-ece8-446b-a1f6-046c409292c0',
    'https://firebasestorage.googleapis.com/v0/b/nintventario.appspot.com/o/img%2Fhome%20page%2FbannerC3.jpg?alt=media&token=52b6f77b-3627-48f6-a825-c206f5c7362c',
  ]
  currentSlide = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  slideInterval: any

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide()
    }, 5000)
  }

  prevSlide() {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.images.length - 1
  }

  nextSlide() {
    this.currentSlide = this.currentSlide < this.images.length - 1 ? this.currentSlide + 1 : 0
  }
  
  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.startAutoSlide()
    this.NewestProducts()
    console.log('entre a INIT')
    this.BestsellingProducts()
  }

  NewestProducts() {
    console.log('entre a NEWEST P')

    this.productService.getNewestProducts().subscribe({
      next: data => {
        this.newProducts = data
        console.log('llame a PROsducTSER', data)
      },
      error: error => {
        console.error('Error fetching newest products:', error)
      },
    })
    console.log('termine a NEWEST P', this.newProducts)
  }

  BestsellingProducts() {
    this.productService.getBestsellingProducts().subscribe({
      next: data => {
        this.bestSellers = data
      },
      error: error => {
        console.error('Error fetching bestselling products:', error)
      },
    })
  }




  searchProduct($event: KeyboardEvent) {
    const codeValue = $event.code
    if (codeValue === 'Enter') {
      const trimmedValue = this.inputValue.trim()
      if (trimmedValue) {
        this.router.navigate(['/todos'], { queryParams: { q: trimmedValue } })
      }
    }
  }

  navigateToAll() {
    this.router.navigateByUrl('/todos')
  }
}
