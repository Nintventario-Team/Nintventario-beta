import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AuthService } from './auth.service'
import { LoginResponse, User } from '../interfaces/user'

describe('AuthService', () => {
  let service: AuthService
  let httpTestingController: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    })

    service = TestBed.inject(AuthService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should login user', () => {
    const mockLoginResponse: LoginResponse = {
      refresh: 'refresh_token',
      access: 'access_token',
      message: 'Login successful',
    }
    const email = 'test@example.com'
    const password = 'password'

    service.login(email, password).subscribe(response => {
      expect(response).toEqual(mockLoginResponse)
    })

    const req = httpTestingController.expectOne(service.loginUrl)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({ email, password })

    req.flush(mockLoginResponse)
  })

  it('should register user', () => {
    const mockRegisterResponse: LoginResponse = {
      refresh: 'refresh_token',
      access: 'access_token',
      message: 'Registration successful',
    }
    const email = 'test@example.com'
    const password = 'password'
    const first_name = 'John'
    const last_name = 'Doe'

    service.register(email, password, first_name, last_name).subscribe(response => {
      expect(response).toEqual(mockRegisterResponse)
    })

    const req = httpTestingController.expectOne(service.registerUrl)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual({
      email,
      password,
      first_name,
      last_name,
    })

    req.flush(mockRegisterResponse)
  })

  it('should logout user', () => {
    service.logout().subscribe(response => {
      expect(response).toBeTruthy()
    })

    const req = httpTestingController.expectOne(service.logoutUrl)
    expect(req.request.method).toEqual('POST')

    req.flush({})
  })

  it('should check login status', () => {
    localStorage.setItem('accessToken', 'test_access_token')

    expect(service.checkLoginStatus()).toBeTruthy()

    localStorage.removeItem('accessToken')

    expect(service.checkLoginStatus()).toBeFalsy()
  })

  it('should get user info', () => {
    const mockUser: User = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
    }

    service.getUserInfo().subscribe(response => {
      expect(response).toEqual(mockUser)
    })

    const req = httpTestingController.expectOne(service.userInfoUrl)
    expect(req.request.method).toEqual('GET')
    expect(req.request.headers.has('Authorization')).toBeTruthy()

    req.flush(mockUser)
  })
})
