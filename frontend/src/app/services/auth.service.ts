import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, BehaviorSubject } from 'rxjs'
import { LoginResponse, User } from '../interfaces/user'
import { CartService } from './cart.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://nintventario.pythonanywhere.com/'
  //baseUrl = 'http://127.0.0.1:8000/'

  registerUrl = this.baseUrl + 'register/'
  loginUrl = this.baseUrl + 'login/'
  logoutUrl = this.baseUrl + 'logout/'
  userInfoUrl = this.baseUrl + 'get-user-data/'
  isLoggedInSubject: BehaviorSubject<boolean>
  public isLoggedIn$: Observable<boolean>

  constructor(
    private http: HttpClient,
    private cartService: CartService,
  ) {
    const currentUser = !!localStorage.getItem('accessToken')
    this.isLoggedInSubject = new BehaviorSubject<boolean>(currentUser)
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable()
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = { email, password }
    this.isLoggedInSubject.next(true)
    return this.http.post<LoginResponse>(this.loginUrl, body, { headers })
  }

  register(email: string, password: string, first_name: string, last_name: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = { email, password, first_name, last_name }
    return this.http.post<LoginResponse>(this.registerUrl, body, { headers })
  }

  logout(): Observable<unknown> {
    localStorage.removeItem('accessToken')
    this.isLoggedInSubject.next(false)
    const headers = new HttpHeaders()
    localStorage.setItem('cart', '[]')
    this.cartService.resetCart()
    return this.http.post<unknown>(this.logoutUrl, {}, { headers })
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('accessToken')
  }

  getUserInfo(): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
    })
    return this.http.get<User>(this.userInfoUrl, { headers })
  }
}
