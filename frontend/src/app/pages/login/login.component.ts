/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { LoginResponse } from '../../interfaces/user'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  email: string = ''
  password: string = ''
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''
  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    if (this.alertService.showAlert) {
      this.alertTopic = this.alertService.alertTopic
      this.alertMessage = this.alertService.alertMessage
      this.alertType = this.alertService.alertType
      this.showAlert = true
      this.alertService.clearAlert()
    }
  }
  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: LoginResponse) => {
        console.log('Login successful', response)
        const accessToken = response.access
        localStorage.setItem('accessToken', accessToken)
        this.alertTopic = 'Login exitoso'
        this.alertMessage = 'Ha iniciado sesión exitosamente.'
        this.alertType = 'verify'
        this.alertComponent.resetAlert()
        this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
        this.router.navigateByUrl('/')
      },
      error => {
        this.alertTopic = 'Error al iniciar sesión'
        this.alertMessage = 'Email o contraseña incorrectos.'
        this.alertType = 'error'
        this.alertComponent.resetAlert()
        console.error('Login error', error)
      },
    )
  }

  navigateToRegister() {
    this.router.navigateByUrl('/register')
  }
}
