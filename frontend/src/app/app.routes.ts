import { Routes } from '@angular/router'
import { LoginComponent } from './pages/login/login.component'
import { RegisterComponent } from './pages/register/register.component'
import { IndexComponent } from './pages/index/index.component'
import { ProductSectionComponent } from './pages/product-section/product-section.component'
import { BlogComponent } from './pages/blog/blog.component'
import { UserDetailsComponent } from './pages/user-details/user-details.component'
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component'
import { LocalsComponent } from './pages/locals/locals.component'
import { ContactComponent } from './pages/contact/contact.component'
import { PaymentGatewayComponent } from './pages/payment-gateway/payment-gateway.component'
import { UserAccountComponent } from './pages/user-details/user-account/user-account.component'
import { UserPurchaseHistoryComponent } from './pages/user-details/user-purchase-history/user-purchase-history.component'
import { TerminosCondicionesComponent } from './pages/terminos-condiciones/terminos-condiciones.component'
import { MetodosPagoComponent } from './pages/metodos-pago/metodos-pago.component'
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component'
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component'
import { EmailChangeConfirmationComponent } from './pages/email-change-confirmation/email-change-confirmation.component'

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'todos', component: ProductSectionComponent, data: { section: 'todos' } },
  {
    path: 'userDetails',
    component: UserDetailsComponent,
    children: [
      { path: '', component: UserAccountComponent },
      { path: 'userAccount', component: UserAccountComponent },
      { path: 'userPurchaseHistory', component: UserPurchaseHistoryComponent },
    ],
  },
  { path: 'videojuegos', component: ProductSectionComponent, data: { section: 'videojuegos' } },
  { path: 'funkopop', component: ProductSectionComponent, data: { section: 'funkopop' } },
  { path: 'consolas', component: ProductSectionComponent, data: { section: 'consolas' } },
  { path: 'otros', component: ProductSectionComponent, data: { section: 'otros' } },
  { path: 'articulos', component: ProductSectionComponent, data: { section: 'articulos' } },
  { path: 'nuevos-productos', component: ProductSectionComponent, data: { section: 'nuevos-productos' } },
  { path: 'mas-vendidos', component: ProductSectionComponent, data: { section: 'mas-vendidos' } },
  { path: 'locales', component: LocalsComponent, data: { section: 'locals' } },
  { path: 'shoppingCart', component: ShoppingCartComponent },
  { path: 'contacto', component: ContactComponent, data: { section: 'contacto' } },
  { path: 'payment', component: PaymentGatewayComponent },
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent },
  { path: 'metodos-pago', component: MetodosPagoComponent },
  { path: 'sobre-nosotros', component: SobreNosotrosComponent },
  { path: 'reset-password/:uid/:token', component: ResetPasswordComponent },
  { path: 'change-confirmation-email', component: EmailChangeConfirmationComponent },
  { path: '**', redirectTo: '' },
]
