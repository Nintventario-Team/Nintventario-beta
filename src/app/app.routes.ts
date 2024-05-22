import { Routes } from '@angular/router';

import { CarritoComponent } from './pages/carrito/carrito.component';
import { CajaComponent } from './pages/caja/caja.component';
import { DatosPersonalesComponent } from './pages/caja/datos-personales/datos-personales.component';
import { MetodoPagoComponent } from './pages/caja/metodo-pago/metodo-pago.component';
import { ConfirmarCompraComponent } from './pages/caja/confirmar-compra/confirmar-compra.component';
import { NovedadesComponent } from './pages/novedades/novedades.component';
import { MasVendidosComponent } from './pages/mas-vendidos/mas-vendidos.component';
import { BusquedaproductComponent } from './pages/busquedaproduct/busquedaproduct.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { IndexComponent } from './pages/index/index.component';
import { VideojuegosComponent } from './pages/videojuegos/videojuegos.component';
import { FunkosComponent  } from './pages/funkos/funkos.component';
import { FigurasComponent } from './pages/figuras/figuras.component';
import { ConsolasComponent } from './pages/consolas/consolas.component';


export const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'videojuegos', component: VideojuegosComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: 'funkos', component: FunkosComponent },
    { path: 'figuras', component: FigurasComponent},
    { path: 'consolas', component: ConsolasComponent},
    { path: 'novedades', component: NovedadesComponent},
    { path: 'vendidos', component: MasVendidosComponent},
    { path: 'busqueda', component: BusquedaproductComponent},
    { path: 'noticias', component: NoticiasComponent},
    {
        path: 'caja',
        component: CajaComponent,
        children: [
            { path: '', component: DatosPersonalesComponent },
          { path: 'datos-personales', component: DatosPersonalesComponent },  
          { path: 'metodo-pago', component: MetodoPagoComponent },      
          { path: 'confirmar-compra', component: ConfirmarCompraComponent },      

        ]
      },

      { path: '**', redirectTo: '' },

];