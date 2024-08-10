import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UserDetailsComponent } from './user-details.component'
import { RouterTestingModule } from '@angular/router/testing'
import { AuthService } from '../../services/auth.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent
  let fixture: ComponentFixture<UserDetailsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, UserDetailsComponent, HttpClientTestingModule],
      providers: [AuthService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have links to user account and purchase history', () => {
    const compiled = fixture.debugElement.nativeElement
    const links = compiled.querySelectorAll('.navbar-links a')
    expect(links.length).toBe(2)
    expect(links[0].getAttribute('routerLink')).toBe('/userDetails/userAccount')
    expect(links[1].getAttribute('routerLink')).toBe('/userDetails/userPurchaseHistory')
  })
})
