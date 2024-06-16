import { Component, NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BannerComponent } from './shared/banner/banner.component';
import { MidBannerComponent } from './shared/mid-banner/mid-banner.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent, BannerComponent, FormsModule, MidBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'MundoNintendo';
  isIndexPage: boolean;
  constructor(private http: HttpClient, private productService: ProductService, private router: Router) {
    this.isIndexPage = this.router.url === '/';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isIndexPage = this.router.url === '/';
      }
    });
  }

}
