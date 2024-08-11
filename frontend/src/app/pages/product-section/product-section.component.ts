/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, RouterLinkActive, RouterLink, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { NgxPaginationModule } from 'ngx-pagination'
import { Product } from '../../interfaces/product'
import { CartItem } from '../../interfaces/cartItem'
import { ProductService } from '../../services/product.service'
import { AuthService } from '../../services/auth.service'
import { User } from '../../interfaces/user'
import { WishlistService } from '../../services/wishlist.service'
import { WishlistResponse } from '../../interfaces/wishlist'
import { FormsModule } from '@angular/forms'
import { CartService } from '../../services/cart.service'

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule, RouterLinkActive, RouterLink, FormsModule],
  providers: [],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css',
})
export class ProductSectionComponent implements OnInit {
  section!:
    | 'todos'
    | 'videojuegos'
    | 'funkopop'
    | 'consolas'
    | 'otros'
    | 'articulos'
    | 'nuevos-productos'
    | 'mas-vendidos'
  genres: string[] = ['Todos', 'Acción', 'Aventura', 'Deportes', 'Estrategia', 'Simulación', 'RPG', 'Puzzle']
  consoles: string[] = ['Todos', 'PS5', 'Nintendo Switch', 'Xbox 360']
  funkos: string[] = ['Todos', 'Heroes', 'Marvel', 'Comics', 'Animation', 'Disney', 'Television', 'Movies']
  articulos: string[] = [
    'PS1',
    'PS2',
    'PS3',
    'PS4',
    'PS5',
    'Wii',
    'Nintendo 3DS',
    'Nintendo Switch',
    'Nintendo Wii',
    'Computadores',
    'Televisores',
    'Tazas',
  ]
  platforms: string[] = [
    'Todos',
    'PS1',
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
  consols: string[] = ['Todos', 'PS5', 'Nintendo Switch']
  data: Product[] = []
  public totalProducts: Product[] = []
  page = 1
  showDetails = false
  selectedProduct: Product | undefined
  minPrice?: number = 0
  maxPrice?: number = 1000
  category: string = ''
  sortOrder: 'asc' | 'desc' | 'alpha-asc' | 'alpha-desc' = 'asc'
  searching: string = ''
  inputValue: string = ''
  showAlert = false
  alertMessage = ''
  alertTimeout: any
  progressWidth = 100
  progressInterval: any
  isLoggedIn: boolean = false
  videogameIsSelected: boolean = false
  funkoIsSelected: boolean = false
  consolIsSelected: boolean = false
  artIsSelected: boolean = false
  otroIsSelected: boolean = false
  allIsSelected: boolean = false
  user: User | null = null
  wishlist: WishlistResponse[] = []

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.section = data['section'] as
        | 'todos'
        | 'videojuegos'
        | 'funkopop'
        | 'consolas'
        | 'otros'
        | 'articulos'
        | 'nuevos-productos'
        | 'mas-vendidos'
      this.route.queryParams.subscribe(params => {
        this.searching = (params['q'] || '').toLowerCase()
        this.getFilteredData()
      })
    })

    this.isLoggedIn = this.authService.checkLoginStatus()
    if (this.isLoggedIn) {
      this.authService.getUserInfo().subscribe(
        (data: User) => {
          this.user = data
          console.log(this.user)
        },
        (error: unknown) => {
          console.error('Error fetching user info:', error)
        },
      )
    } else {
      console.error('User not authenticated')
    }
    if (this.isLoggedIn) {
      this.loadWishlist()
    }
    this.authService.isLoggedIn$.subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn))

    if (this.section === 'videojuegos') {
      this.videogameIsSelected = true
      console.log('videojuegosssssssssssss')
    }
    if (this.section === 'funkopop') {
      this.funkoIsSelected = true
    }
    if (this.section === 'consolas') {
      this.consolIsSelected = true
    }
    if (this.section === 'articulos') {
      this.artIsSelected = true
    }
    if (this.section === 'otros') {
      this.otroIsSelected = true
    }
    if (this.section === 'todos') {
      this.allIsSelected = true
    }
  }

  getNameWithoutParentheses(name: string): string {
    const nameWithoutParentheses = name.replace(/\(.*?\)/g, '').trim()
    return nameWithoutParentheses.charAt(0).toUpperCase() + nameWithoutParentheses.slice(1).toLowerCase()
  }

  search(): void {
    if (!this.searching) {
      this.data = [...this.totalProducts]
    } else {
      this.data = this.totalProducts.filter(product => product.name.toLowerCase().includes(this.searching))
    }
  }

  getFilteredData(): void {
    if (this.section === 'nuevos-productos') {
      this.productService.getNewestProducts().subscribe(products => {
        this.data = this.totalProducts = products
        this.sortProductsFilter(this.sortOrder)
        this.search()
      })
    } else if (this.section === 'mas-vendidos') {
      this.productService.getBestsellingProducts().subscribe(products => {
        this.data = this.totalProducts = products
        this.sortProductsFilter(this.sortOrder)
        this.search()
      })
    } else {
      const sectionMappings = {
        todos: '',
        consolas: 'consola',
        videojuegos: 'jue',
        funkopop: 'pop',
        otros: 'muñecos',
        articulos: 'acc',
      }
      const sectionToFilter = sectionMappings[this.section]
      this.productService
        .getFilteredProducts(this.minPrice, this.maxPrice, sectionToFilter, this.category)
        .subscribe(products => {
          this.data = this.totalProducts = products
          this.sortProductsFilter(this.sortOrder)
          this.search()
        })
    }
  }

  updatePriceRange(min: number, max: number): void {
    this.minPrice = min
    this.maxPrice = max
    this.getFilteredData()
  }

  sortProductsFilter(order: string): void {
    if (order === 'asc') {
      this.data.sort((a, b) => a.price - b.price)
    } else if (order === 'desc') {
      this.data.sort((a, b) => b.price - a.price)
    } else if (order === 'alpha-asc') {
      this.data.sort((a, b) => a.name.localeCompare(b.name))
    } else if (order === 'alpha-desc') {
      this.data.sort((a, b) => b.name.localeCompare(a.name))
    }
  }

  sortProducts(event: Event): void {
    const selectElement = event.target as HTMLSelectElement
    const value = selectElement.value

    if (value === 'asc') {
      this.data.sort((a, b) => a.price - b.price)
      this.sortOrder = 'asc'
    } else if (value === 'desc') {
      this.data.sort((a, b) => b.price - a.price)
      this.sortOrder = 'desc'
    } else if (value === 'alpha-asc') {
      this.data.sort((a, b) => a.name.localeCompare(b.name))
      this.sortOrder = 'alpha-asc'
    } else if (value === 'alpha-desc') {
      this.data.sort((a, b) => b.name.localeCompare(a.name))
      this.sortOrder = 'alpha-desc'
    }
  }

  filterByGenre(genre: string): void {
    if (genre === 'Todos') {
      this.category = ''
      this.getFilteredData()
      return
    } else if (genre === 'Nintendo Switch') {
      this.category = 'switch'
    } else {
      this.category = genre
    }
    this.getFilteredData()
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
  addCart(event: Event, selectedProduct: Product): void {
    event.stopPropagation()

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

    this.cartService.addToCart(cartItem) // Asegúrate de que esta línea esté correcta
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

  addWishlist(product: Product) {
    this.wishlistService.addToWishlist(product.id).subscribe(
      response => {
        this.loadWishlist()
        console.log('Producto añadido a la wishlist', response)
        alert('Producto añadido a la wishlist')
      },
      error => {
        console.error('Error añadiendo producto a la wishlist', error)
        alert('Error añadiendo producto a la wishlist')
      },
    )
  }

  removeWishlist(product: Product) {
    this.wishlistService.removeFromWishlist(product.id).subscribe(
      response => {
        console.log('Producto eliminado de la wishlist', response)
        this.wishlist = this.wishlist.filter(p => p.id !== product.id)
        alert('Producto eliminado de la wishlist')
      },
      error => {
        console.error('Error eliminando producto de la wishlist', error)
        alert('Error eliminando producto de la wishlist')
      },
    )
  }
  loadWishlist() {
    this.wishlistService.getWishlist().subscribe(
      (products: WishlistResponse[]) => {
        this.wishlist = products
        console.log('Wishlist loaded', this.wishlist)
      },
      error => {
        console.error('Error loading wishlist', error)
      },
    )
  }
  isProductInWishlist(productSelected: Product): boolean {
    return this.wishlist.some(product => product.id === productSelected.id)
  }

  validateWishlist(event: MouseEvent, product: Product) {
    event.stopPropagation()

    if (this.isLoggedIn) {
      if (this.isProductInWishlist(product)) {
        this.removeWishlist(product)
      } else {
        this.addWishlist(product)
      }
    } else {
      alert('Necesitas estar loggeado para eliminar un producto de la wishlist')
    }
  }

  searchProduct($event: KeyboardEvent) {
    const codeValue = $event.code
    const page = '/' + this.section
    if (codeValue === 'Enter') {
      const trimmedValue = this.inputValue.trim()
      if (trimmedValue) {
        this.router.navigate([page], { queryParams: { q: trimmedValue } })
      } else if (trimmedValue === '') {
        this.router.navigate([page])
      }
    }
  }

  searchIcon() {
    const page = '/' + this.section
    const trimmedValue = this.inputValue.trim()
    if (trimmedValue) {
      this.router.navigate([page], { queryParams: { q: trimmedValue } })
    } else if (trimmedValue === '') {
      this.router.navigate([page])
    }
  }
}
export { CartItem }

