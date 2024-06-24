import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing'
import { Router } from '@angular/router'
import { NavbarComponent } from './navbar.component'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [NavbarComponent, FormsModule, RouterTestingModule, HttpClientModule],
      providers: [AuthService],
    }).compileComponents()

    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
    router = TestBed.inject(Router)

    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should navigate to login page', () => {
    spyOn(router, 'navigateByUrl')

    component.navigateToLogin()

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login')
  })

  it('should toggle search bar visibility', () => {
    expect(component.isSearchBarVisible).toBeFalse()

    component.toggleSearchBar()
    expect(component.isSearchBarVisible).toBeTrue()

    component.toggleSearchBar()
    expect(component.isSearchBarVisible).toBeFalse()
  })

  it('should search product when Enter key is pressed', fakeAsync(() => {
    const inputValue = 'test product'
    const trimmedValue = inputValue.trim()
    component.inputValue = inputValue

    spyOn(router, 'navigate')

    const event = new KeyboardEvent('keyup', { code: 'Enter' })
    component.searchProduct(event)

    tick()

    expect(router.navigate).toHaveBeenCalledWith(['/todos'], {
      queryParams: { q: trimmedValue },
    })
  }))
})
