
import {  Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AppComponent } from './app.component';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '/' },
  ];

