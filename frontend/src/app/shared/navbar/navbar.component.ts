import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSearchBarVisible = false;

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

  toggleSearchBar() {
    this.isSearchBarVisible = !this.isSearchBarVisible;
  }
}
