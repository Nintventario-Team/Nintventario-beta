/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLinkActive, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination'
import { Product } from '../../interfaces/product'
import { CartItem } from '../../interfaces/cartItem'
import { ProductService } from '../../services/product.service'

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLinkActive, RouterLink],
  providers: [],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit {
  section!: 'todos' | 'videojuegos' | 'funkopop' | 'consolas' | 'coleccionables' | 'accesorios'
  genres: string[] = ['Acción', 'Aventura', 'Deportes', 'Estrategia', 'Simulación', 'RPG', 'Puzzle']
  consoles: string[] = ['PS5', 'Nintendo Switch', 'Xbox 360']
  funkos: string[] = ['Heroes', 'Marvel', 'Comics', 'Animation', 'Disney', 'Television', 'Movies']
  platforms: string[] = [
    'PS5',
    'PS2',
    'PS3',
    'PS4',
    'PS5',
    'Wii',
    'Nintendo 3DS',
    'PSP Vita',
    'Xbox One',
    'Xbox 360',
    'Nintendo Switch',
  ]
  data: Product[] = []
  public totalProducts: Product[] = []
  page = 1
  showDetails = false
  selectedProduct: Product | undefined
  minPrice?: number = 0
  maxPrice?: number = 1000
  sortOrder: 'asc' | 'desc' = 'asc'
  searching: string = ''
  inputValue: string = ''
  showAlert = false
  alertMessage = ''
  alertTimeout: any
  progressWidth = 100
  progressInterval: any

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.section = data['section'] as
        | 'todos'
        | 'videojuegos'
        | 'funkopop'
        | 'consolas'
        | 'coleccionables'
        | 'accesorios'
      this.route.queryParams.subscribe(params => {
        this.searching = (params['q'] || '').toLowerCase()
        this.getFilteredData()
      })
    })
  }

  replaceUnderscores(name: string): string {
    return name.replace(/_/g, ' ')
  }

  search(): void {
    if (!this.searching) {
      this.data = [...this.totalProducts]
    } else {
      this.data = this.totalProducts.filter(product => product.name.toLowerCase().includes(this.searching))
    }
  }

  getFilteredData(): void {
    const sectionMappings = {
      todos: '',
      consolas: 'consola',
      videojuegos: 'jue',
      funkopop: 'pop',
      coleccionables: 'muñecos',
      accesorios: 'acc',
    }

    const sectionToFilter = sectionMappings[this.section]

    this.productService.getFilteredProducts(this.minPrice, this.maxPrice, sectionToFilter).subscribe(products => {
      this.data = this.totalProducts = products
      this.sortProducts(this.sortOrder)
      this.search()
    })
  }

  updatePriceRange(min: number, max: number): void {
    this.minPrice = min
    this.maxPrice = max
    this.getFilteredData()
  }

  sortProducts(order: 'asc' | 'desc') {
    this.page = 1
    this.sortOrder = order

    if (this.sortOrder === 'asc') {
      this.data.sort((a, b) => a.price - b.price)
    } else {
      this.data.sort((a, b) => b.price - a.price)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterByGenre(genre: string): void {
    // Filtrar los videojuegos por género
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filterByPlatform(platform: string): void {
    // Filtrar los videojuegos por plataforma
  }

  openDetails(producto: Product): void {
    this.selectedProduct = producto
    this.showDetails = true
  }

  closeDetails(): void {
    this.showDetails = false
    this.selectedProduct = undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCart(event: Event, selectedProduct: any): void {
    event.stopPropagation() // Evita que el clic se propague al contenedor del producto

    if (!selectedProduct) {
      console.error('No product selected.')
      return
    }

    const cartItem: CartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      maxQuantity: selectedProduct.quantity,
      quantityToBuy: 1,
      details: selectedProduct.details,
      image: selectedProduct.image,
    }

    let cart: CartItem[] = []

    const cartJson = localStorage.getItem('cart')
    if (cartJson) {
      try {
        cart = JSON.parse(cartJson)
      } catch (e) {
        console.error('Error parsing cart data:', e)
        cart = []
      }
    }

    const itemIndex = cart.findIndex(item => item.id === cartItem.id)

    if (itemIndex < 0) {
      cart.push(cartItem)
    } else {
      cart[itemIndex].quantityToBuy++
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    this.showAlertMessage('Producto añadido al carrito')
  }

  showAlertMessage(message: string): void {
    this.alertMessage = message
    this.showAlert = true
    this.progressWidth = 100

    clearInterval(this.progressInterval)
    clearTimeout(this.alertTimeout)

    const totalDuration = 7000
    const intervalDuration = 100
    const decrementAmount = (intervalDuration / totalDuration) * 100

    this.progressInterval = setInterval(() => {
      this.progressWidth -= decrementAmount
      if (this.progressWidth <= 0) {
        this.closeAlert()
      }
    }, intervalDuration)

    this.alertTimeout = setTimeout(() => {
      this.showAlert = false
      clearInterval(this.progressInterval)
    }, totalDuration)
  }

  closeAlert(): void {
    this.showAlert = false
    clearTimeout(this.alertTimeout)
    clearInterval(this.progressInterval)
  }
}
