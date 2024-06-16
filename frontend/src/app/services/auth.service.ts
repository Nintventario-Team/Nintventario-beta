import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://127.0.0.1:8000/register/';
  private loginUrl = 'http://127.0.0.1:8000/login/';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };
    return this.http.post(this.loginUrl, body, { headers });
  }

  register(email: string, password: string, password2: string, first_name: string, last_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password, password2, first_name, last_name };
    return this.http.post(this.registerUrl, body, { headers });
  }
}