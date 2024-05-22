import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink, Router } from '@angular/router';
import { DataProviderService } from '../../providers/data-provider.service';
import { Producto } from '../../interfaces/producto';
import { BusquedaService } from '../../services/busqueda.service';
@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  searchTerm: string = '';
  public data: Producto[] = [];
  searchType: string = 'figura';
  constructor(private dataProviderService: DataProviderService, private router: Router, private busquedaService: BusquedaService) { }

  performSearch(searchTerm: string): void {
    this.dataProviderService.getProductsByName(searchTerm).subscribe((response) => {
      if (Array.isArray(response)) {
        let dataArray = (response as Producto[]);
        this.data = dataArray;
        console.log(this.data);
      } else {
        this.data = [];
        console.log('La respuesta no es un array:', response);
      }
      this.busquedaService.updateSearchResults(this.data);
      this.router.navigate(['/busqueda']);
    });
  }
}
