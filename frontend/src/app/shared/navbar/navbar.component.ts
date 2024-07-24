import { Component, HostListener } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLinkActive, RouterLink, Router } from '@angular/router'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isSearchBarVisible = false
  isLoggedIn: boolean | undefined
  inputValue: string = ''
  menuVisible = false
  submenu = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedCategory: any
  categories = [
    {
      title: 'Videojuegos',
      items: [
        'Videojuegos para nintendo 3DS',
        'Videojuegos para nintendo Wii',
        'Videojuegos para nintendo Switch',
        'Videojuegos para PS1',
        'Videojuegos para PS2',
        'Videojuegos para PS3',
        'Videojuegos para PS4',
        'Videojuegos para PS5',
        'Videojuegos para Xbox',
        'Videojuegos para Xbox One',
        'Videojuegos para Xbox 360',
      ],
    },
    { title: 'Funko-Pops', items: ['Funkos de mario bros', 'Funkos de marvel', 'Funkos de DC'] },
    { title: 'Consolas', items: ['Consolas PS4', 'Consolas PS5', 'Consolas Nintendo Switch'] },
    {
      title: 'Artículos',
      items: [
        'Artículos para computadores',
        'Artículos para nintendo 3DS',
        'Artículos para nintendo Wii',
        'Artículos para nintendo switch',
        'Artículos para PS1',
        'Artículos para PS2',
        'Artículos para PS3',
        'Artículos para PS4',
        'Artículos para PS5',
        'Artículos para televisores',
        'Tazas',
      ],
    },
    { title: 'Otros', items: ['Otros...'] },
  ]
  toggleMenu() {
    this.menuVisible = !this.menuVisible
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSubMenu(category: any) {
    this.selectedCategory = category
    this.submenu = true
  }

  closeSubMenu() {
    this.submenu = false
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
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.isLoggedIn = this.authService.checkLoginStatus()
    this.authService.isLoggedIn$.subscribe(isLoggedIn => (this.isLoggedIn = isLoggedIn))
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }

  navigateToUserDetails() {
    this.router.navigateByUrl('/userDetails')
  }

  navigateToHome() {
    this.router.navigateByUrl('')
  }

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible
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
}
