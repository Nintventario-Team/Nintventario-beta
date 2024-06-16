import { Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import {ProductSectionComponent} from './pages/product-section/product-section.component'
export const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'videojuegos', component: ProductSectionComponent, data: { section: 'videojuegos' } },
    { path: 'funkopop', component: ProductSectionComponent, data: { section: 'funkopop' } },
    { path: 'consolas', component: ProductSectionComponent, data: { section: 'consolas' } },
    { path: 'coleccionables', component: ProductSectionComponent, data: { section: 'coleccionables' } },
    

    {path:'shoppingCart',component:ShoppingCartComponent},

    { path: '**', redirectTo: '' },
];
