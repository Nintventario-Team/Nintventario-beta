import { Component, HostListener, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  RouterLinkActive,
  RouterLink,
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
} from '@angular/router'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ShoppingCartModalComponent } from '../../pages/shopping-cart-modal/shopping-cart-modal.component'
import { WishlistService } from '../../services/wishlist.service'
import { WishlistModalComponent } from '../../pages/wishlist-modal/wishlist-modal.component'
import { User } from '../../interfaces/user'
import { CartItem } from '../../interfaces/cartItem'
import { CartService } from '../../services/cart.service'
import { AlertComponent } from '../../shared/alert/alert.component'
import { PlatformService } from '../../services/platform.service'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterModule, FormsModule, AlertComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  isSearchBarVisible = false
  isLoggedIn: boolean | undefined
  username: string | undefined
  inputValue: string = ''
  menuVisible = false
  submenuVisible = false
  subsubmenuVisible = false
  userInfo: User | undefined
  isCartEmpty: boolean = true
  public productshop?: CartItem[]
  public totalProducts: number = 0
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedCategory: any
  categories = [
    {
      title: 'Videojuegos',
      items: [
        'Todos',
        'Nintendo 3DS',
        'Nintendo Wii',
        'Nintendo Switch',
        'PS1',
        'PS2',
        'PS3',
        'PS4',
        'PS5',
        'Xbox One',
        'Xbox 360',
      ],
    },
    {
      title: 'Funko-Pops',
      items: ['Todos', 'Heroes', 'Marvel', 'Comics', 'Animation', 'Disney', 'Television', 'Movies'],
    },
    { title: 'Consolas', items: ['Todos', 'PS5', 'Nintendo Switch'] },
    {
      title: 'Artículos',
      items: [
        'Todos',
        'Cables',
        'Cargadores',
        'Nintendo 3DS',
        'Nintendo Wii',
        'Nintendo switch',
        'PS1',
        'PS2',
        'PS3',
        'PS4',
        'PS5',
        'Tazas',
      ],
    },
    { title: 'Otros', items: ['Otros...'] },
  ]

  constructor(
    private platformService: PlatformService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private wishlistService: WishlistService,
    private cartService: CartService,
  ) {
    this.isLoggedIn = this.authService.checkLoginStatus()
    this.authService.isLoggedIn$.subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn))
    this.username = 'sds' //this.authService.getUsername() // Assuming you have a method to get the username
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible
  }

  openMenu() {
    this.submenuVisible = !this.submenuVisible
  }

  navigateToVideojuegos(platform: string) {
    console.log('Platform:', platform)
    if(platform == 'nintendo 3ds') {
      this.platformService.setPlatform('3ds')
    } else if(platform == 'nintendo wii') {
      this.platformService.setPlatform('wii')
    } else if(platform == 'nintendo switch') {
      this.platformService.setPlatform('switch')
    }else{
      this.platformService.setPlatform(platform)
    }
    this.router.navigate(['/videojuegos'])
    this.toggleMenu() // Cierra el menú móvil después de navegar
  }

  navigateToFunkos(category: string) {
    this.platformService.setFunkoCategory(category)
    this.router.navigate(['/funkopop'])
    this.toggleMenu() // Cierra el menú móvil después de navegar
  }

  navigateToConsola(category: string) {
    if (category == 'nintendo switch') {
      this.platformService.setConsolaCategory('switch')
    }else{
      this.platformService.setConsolaCategory(category)
    }
    this.router.navigate(['/consolas'])
    this.toggleMenu() // Cierra el menú móvil después de navegar
  }

  navigateToArticle(category: string) {
    if (category == 'cables') {
      this.platformService.setArticleCategory('transferencia')
    }else if (category == 'tazas') {
      this.platformService.setArticleCategory('taza')
    }else if (category == 'cargadores') {
      this.platformService.setArticleCategory('cargador')
    } else if (category == 'nintendo 3ds') {
      this.platformService.setArticleCategory('3ds')
    } else if (category == 'nintendo wii') {
      this.platformService.setArticleCategory('wii')
    } else if (category == 'nintendo switch') {
      this.platformService.setArticleCategory('switch')
    } else {
      this.platformService.setArticleCategory(category)
    }
    
    this.router.navigate(['/articulos'])
    this.toggleMenu() // Cierra el menú móvil después de navegar
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSubMenu(category: any) {
    this.selectedCategory = category
    this.submenuVisible = false
    this.subsubmenuVisible = true
  }

  closeSubMenu() {
    this.submenuVisible = false
    this.subsubmenuVisible = false
  }

  closeSubSubMenu() {
    this.subsubmenuVisible = false
    this.submenuVisible = true
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('header')

    if (header) {
      const headerPaddingTop = 0.02 * window.innerHeight

      if (window.pageYOffset > headerPaddingTop) {
        header.classList.add('scrolled')
        header.classList.add('expanded')
      } else {
        header.classList.remove('scrolled')
        header.classList.remove('expanded')
      }
    }
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started:', event)
      } else if (event instanceof NavigationEnd) {
        console.log('Navigation ended:', event)
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error)
      } else if (event instanceof NavigationCancel) {
        console.log('Navigation canceled:', event)
      }
    })

    if (this.authService.checkLoginStatus()) {
      this.authService.getUserInfo().subscribe(
        (data: User) => {
          this.userInfo = data
        },
        (error: unknown) => {
          console.error('Error fetching user info:', error)
        },
      )
    } else {
      console.error('User not authenticated')
    }

    const cartItem = localStorage.getItem('cart')
    if (cartItem !== null) {
      try {
        this.productshop = JSON.parse(cartItem)
        this.totalProducts = this.productshop ? this.productshop.length : 0
        this.isCartEmpty = this.totalProducts === 0
      } catch (e) {
        console.error('Error parsing cart data:', e)
      }
    } else {
      this.productshop = []
      this.isCartEmpty = true
    }

    this.cartService.totalProducts$.subscribe(total => {
      if (total === 0) {
        this.totalProducts = 0
      } else {
        this.totalProducts = total
      }
    })
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/')
    this.toggleMenu()
  }

  openWishlistModal() {
    if (this.isLoggedIn) {
      this.wishlistService.getWishlist().subscribe(
        wishlistItems => {
          this.dialog.open(WishlistModalComponent, {
            data: { products: wishlistItems },
            width: '80%',
            backdropClass: 'blur-backdrop',
          })
        },
        error => {
          console.error('Error loading wishlist', error)
        },
      )
    } else {
      this.alertTopic = 'Error al abrir lista de deseos'
      this.alertMessage = 'Por favor inicia sesión para ver tu lista de deseos.'
      this.alertType = 'error'
      this.alertComponent.resetAlert()
      console.log('User not authenticated')
    }
  }

  openCartModal() {
    const cartItem = localStorage.getItem('cart')
    const productshop = cartItem ? JSON.parse(cartItem) : []
    this.dialog.open(ShoppingCartModalComponent, {
      width: '80%',
      data: { productshop },
      backdropClass: 'blur-backdrop',
    })
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
    this.toggleMenu()
  }

  navigateToUserDetails() {
    this.router.navigateByUrl('/userDetails')
    this.toggleMenu()
  }

  navigateToHome() {
    this.router.navigateByUrl('/')
  }

  navigateToHomeFromMobile() {
    this.router.navigateByUrl('/')
    this.toggleMenu()
  }

  navigateToLocales() {
    this.router.navigateByUrl('/locales')
    this.toggleMenu()
  }

  navigateToContacto() {
    this.router.navigateByUrl('/contacto')
    this.toggleMenu()
  }

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible
  }

  searchProduct($event: KeyboardEvent) {
    const codeValue = $event.code
    if (codeValue === 'Enter') {
      const trimmedValue = this.inputValue.trim()
      if (trimmedValue) {
        this.router.navigate(['/search'], { queryParams: { query: trimmedValue } })
        this.inputValue = ''
      }
    }
  }

  hideSearchBar() {
    this.isSearchBarVisible = false
  }

  closeModal() {
    this.dialog.closeAll()
  }
}
