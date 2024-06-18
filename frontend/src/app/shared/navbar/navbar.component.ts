import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isSearchBarVisible = false;
  isLoggedIn: boolean | undefined; 
  inputValue: string = '';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('header');

    if (header) {
      const headerPaddingTop = 0.02 * window.innerHeight;

      if (window.pageYOffset > headerPaddingTop) {
        header.classList.add('scrolled');
        header.classList.add('expanded');
      } else {
        header.classList.remove('scrolled');
        header.classList.remove('expanded');
      }
    }
  }
  constructor(private router: Router, private authService: AuthService) { 
    this.isLoggedIn = this.authService.checkLoginStatus();
    this.authService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  navigateToUserDetails() {
    this.router.navigateByUrl('/userDetails');
  }

  navigateToHome() {
    this.router.navigateByUrl('');
  }

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible;
  }

  searchProduct($event: KeyboardEvent) {
    var codeValue = $event.code;
    if (codeValue === 'Enter') {
      const trimmedValue = this.inputValue.trim();
      if (trimmedValue) { 
        this.router.navigate(['/todos'], { queryParams: { q: trimmedValue } });
      }
    }
  }
}
