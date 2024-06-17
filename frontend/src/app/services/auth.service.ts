import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://127.0.0.1:8000/register/';
  private loginUrl = 'http://127.0.0.1:8000/login/';
  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(private http: HttpClient) { 
    const currentUser = !!localStorage.getItem('currentUser');
    this.isLoggedInSubject = new BehaviorSubject<boolean>(currentUser);
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    localStorage.setItem('currentUser', 'true');
    this.isLoggedInSubject.next(true);
    return this.isLoggedIn$;
    return this.http.post(this.loginUrl, body, { headers });
  }

  register(email: string, password: string, password2: string, first_name: string, last_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password, password2, first_name, last_name };
    return this.http.post(this.registerUrl, body, { headers });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.isLoggedInSubject.next(false);
  }

  checkLoginStatus(): boolean {
    return !!localStorage.getItem('currentUser');
  }

}