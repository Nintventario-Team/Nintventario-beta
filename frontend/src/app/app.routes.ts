import { Routes } from '@angular/router';

import { IndexComponent } from './pages/index/index.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

export const routes: Routes = [
    { path: '', component: IndexComponent },
    {path:'shoppingCart',component:ShoppingCartComponent},

    { path: '**', redirectTo: '' },
];
