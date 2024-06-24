import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing'
import { RegisterComponent } from './register.component'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { of, throwError } from 'rxjs'

describe('RegisterComponent', () => {
  let component: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>
  let authService: jasmine.SpyObj<AuthService>
  let router: Router

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register'])
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [FormsModule, CommonModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: Router,
          useClass: class {
            navigateByUrl = jasmine.createSpy('navigateByUrl')
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(RegisterComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>
    router = TestBed.inject(Router)
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should register successfully', fakeAsync(() => {
    const mockResponse = {
      access: 'mockAccessToken',
      refresh: 'mockRefreshToken',
      message: 'User registered successfully',
    }
    authService.register.and.returnValue(of(mockResponse))

    const consoleSpy = spyOn(console, 'log')
    component.email = 'test@example.com'
    component.password = 'password'
    component.first_name = 'John'
    component.last_name = 'Doe'
    component.onSubmit()
    tick()

    expect(router.navigateByUrl).toHaveBeenCalledWith('/')
    expect(consoleSpy).toHaveBeenCalledWith('Registration successful', mockResponse)
    expect(component.errorMessage).toEqual('')
  }))

  it('should handle registration error', fakeAsync(() => {
    const errorMessage = 'Email already exists'
    authService.register.and.returnValue(throwError({ error: { error: errorMessage } }))

    const consoleSpy = spyOn(console, 'error')

    component.email = 'existing@example.com'
    component.password = 'password'
    component.first_name = 'Jane'
    component.last_name = 'Doe'
    component.onSubmit()
    tick()

    expect(router.navigateByUrl).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Registration error', {
      error: { error: errorMessage },
    })
    expect(component.errorMessage).toEqual(errorMessage)
  }))
})
