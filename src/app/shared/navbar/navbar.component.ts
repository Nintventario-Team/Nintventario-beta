import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataProviderService } from '../../providers/data-provider.service';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { BusquedaService } from '../../services/busqueda.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  searchTerm: string = '';
  public data: Producto[] = [];

  constructor(private dataProviderService: DataProviderService, private router: Router, private busquedaService: BusquedaService) { }

  performSearch(searchTerm: string): void {
    const currentRoute = this.router.url;

    if (currentRoute.includes('/videojuegos')) {
      this.dataProviderService.getProductsByNameAndType(searchTerm, 'videojuego').subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    } else if (currentRoute.includes('/funkos')) {
      this.dataProviderService.getProductsByNameAndType(searchTerm, 'funko').subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    }else if (currentRoute.includes('/figuras')) {
      this.dataProviderService.getProductsByNameAndType(searchTerm, 'figura').subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    }else if (currentRoute.includes('/consolas')) {
      this.dataProviderService.getProductsByNameAndType(searchTerm, 'consola').subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    }else if (currentRoute.includes('/novedades')) {
      this.dataProviderService.getProductsByNameAndNew(searchTerm).subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    }else if (currentRoute.includes('/vendidos')) {
      this.dataProviderService.getProductsByNameAndLeast(searchTerm).subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
      });
    }else{
      this.dataProviderService.getProductsByName(searchTerm).subscribe((response) => {
        if (Array.isArray(response)) {
          let dataArray = (response as Producto[]);
          this.data = dataArray;
          console.log(this.data);
        }else {
          this.data = [];
          console.log('La respuesta no es un array:', response);
        }
        this.busquedaService.updateSearchResults(this.data);
        this.router.navigate(['/busqueda']);
      });
    }
  }
}
