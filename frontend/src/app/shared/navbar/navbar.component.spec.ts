import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { NavbarComponent } from './navbar.component'
import { AuthService } from '../../services/auth.service'
import { WishlistService } from '../../services/wishlist.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule,HttpClientTestingModule],
      providers: [WishlistService,AuthService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle menu visibility when toggleMenu is called', () => {
    expect(component.menuVisible).toBe(false)
    component.toggleMenu()
    expect(component.menuVisible).toBe(true)
  })

  it('should navigate to home on logo click', () => {
    spyOn(component, 'navigateToHome')
    const logo = fixture.debugElement.nativeElement.querySelector('.navbar-logo img')
    logo.click()
    expect(component.navigateToHome).toHaveBeenCalled()
  })
})
