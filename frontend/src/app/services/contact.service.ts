/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://nintventario.pythonanywhere.com/'

  constructor(private http: HttpClient) {}

  sendContactEmail(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'send-contact-email/', contactData)
  }

  sendRegisterEmail(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'send-register-email/', contactData)
  }

  sendBuyEmail(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'send-buy-email/', contactData)
  }

  sendBuyEmailToCompany(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl + 'send-buy-email-to-company/', contactData)
  }
}
