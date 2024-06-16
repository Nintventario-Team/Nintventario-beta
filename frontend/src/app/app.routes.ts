
import {  Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { IndexComponent } from './pages/index/index.component';
import {ProductSectionComponent} from './pages/product-section/product-section.component'
import {BlogComponent } from './pages/blog/blog.component'
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';

export const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'blog', component: BlogComponent},
    { path: 'videojuegos', component: ProductSectionComponent, data: { section: 'videojuegos' } },
    { path: 'funkopop', component: ProductSectionComponent, data: { section: 'funkopop' } },
    { path: 'consolas', component: ProductSectionComponent, data: { section: 'consolas' } },
    { path: 'coleccionables', component: ProductSectionComponent, data: { section: 'coleccionables' } },
    { path:'shoppingCart',component:ShoppingCartComponent},

    { path: '**', redirectTo: '' },
  ];

