import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';


import { IndexComponent } from './pages/index/index.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BannerComponent } from './shared/banner/banner.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';
import { MasVendidosComponent } from './pages/mas-vendidos/mas-vendidos.component';
import { BusquedaproductComponent } from './pages/busquedaproduct/busquedaproduct.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { DatosPersonalesComponent } from './pages/caja/datos-personales/datos-personales.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule,CommonModule, RouterOutlet, IndexComponent, VideojuegosComponent,CarritoComponent, NavbarComponent, FooterComponent, BannerComponent,NovedadesComponent,MasVendidosComponent,BusquedaproductComponent,NoticiasComponent,DatosPersonalesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MundoNintendo';
  isIndexPage: boolean;

  constructor(private router: Router) {
    this.isIndexPage = this.router.url === '/';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isIndexPage = this.router.url === '/';
      }
    });
  }
}