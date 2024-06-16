import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,RouterLinkActive, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusquedaService } from '../../services/busqueda.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Product } from '../../interfaces/product';


@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterLinkActive,
    RouterLink,
  ],
  providers: [],
  templateUrl: './product-section.component.html',
  styleUrl: './product-section.component.css'
})
export class ProductSectionComponent implements OnInit {
  section!: 'videojuegos' | 'funkopop' | 'consolas' | 'coleccionables';
  data : Product[]=[]; 
  page = 1; 
  showDetails = false;
  selectedProduct: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.section = data['section'] as ('videojuegos' | 'funkopop' | 'consolas' | 'coleccionables');
      this.loadData();
    });
  }

  loadData(): void {
    if (this.section === 'consolas') {
      // Cargar datos de consolas
    } else if (this.section === 'videojuegos') {
      // Cargar datos de videojuegos
    } else if (this.section === 'funkopop') {
      // Cargar datos de funkopop
    } else if (this.section === 'coleccionables') {
      // Cargar datos de coleccionables
    }
  }

  updatePriceRange(min: number, max: number): void {
    // Filtrar los productos por rango de precio
  }

  sortByPriceAscending(): void {
    // Ordenar los productos por precio ascendente
  }

  sortByPriceDescending(): void {
    // Ordenar los productos por precio descendente
  }

  filterByGenre(genre: string): void {
    // Filtrar los videojuegos por género
  }

  getFilteredData(): void {
    // Obtener datos filtrados
  }

  openDetails(producto: any): void {
    this.selectedProduct = producto;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedProduct = undefined;
  }

  addCart(): void {
    // Agregar el producto al carrito
  }
}