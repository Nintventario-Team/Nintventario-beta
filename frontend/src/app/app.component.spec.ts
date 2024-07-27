import { TestBed, ComponentFixture } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { RouterTestingModule } from '@angular/router/testing'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NavbarComponent } from './shared/navbar/navbar.component'
import { FooterComponent } from './shared/footer/footer.component'
import { BannerComponent } from './shared/banner/banner.component'
import { MidBannerComponent } from './shared/mid-banner/mid-banner.component'
import { HttpClientModule } from '@angular/common/http'
import { MatDialogModule } from '@angular/material/dialog'
import { ShoppingCartModalComponent } from './pages/shopping-cart-modal/shopping-cart-modal.component'


describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        HttpClientModule,
        NavbarComponent,
        FooterComponent,
        BannerComponent,
        MidBannerComponent,
        ShoppingCartModalComponent,
        MatDialogModule,
      ],
      providers: [],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should set isIndexPage correctly for root URL', () => {
    component.router.navigateByUrl('/')
    expect(component.isIndexPage).toBe(true)
  })
})
