/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { LoginResponse } from '../../interfaces/user'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = ''
  password: string = ''
  errorMessage: string = ''
  showAlert = false
  alertMessage = ''
  alertTimeout: any
  progressWidth = 100
  progressInterval: any
  alertClass: string = ''
  progressColor: string = ''
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: LoginResponse) => {
        console.log('Login successful', response)
        const accessToken = response.access
        localStorage.setItem('accessToken', accessToken)
        this.showAlertMessage('Logeado correctamente', 'success')
        this.router.navigateByUrl('/')
      },
      error => {
        this.errorMessage = 'Invalid credentials'
        this.showAlertMessage('Correo o contraseña incorrectos', 'error')
        console.error('Login error', error)
      },
    )
  }

  navigateToRegister() {
    this.router.navigateByUrl('/register')
  }

  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message
    this.showAlert = true
    this.progressWidth = 100

    if (type === 'success') {
      this.alertClass = 'alert-success'
      this.progressColor = '#76c7c0'
    } else {
      this.alertClass = 'alert-error'
      this.progressColor = '#FFFFFF'
    }

    clearInterval(this.progressInterval)
    clearTimeout(this.alertTimeout)

    const totalDuration = 5000
    const intervalDuration = 100
    const decrementAmount = (intervalDuration / totalDuration) * 100

    this.progressInterval = setInterval(() => {
      this.progressWidth -= decrementAmount
      if (this.progressWidth <= 0) {
        this.closeAlert()
      }
    }, intervalDuration)

    this.alertTimeout = setTimeout(() => {
      this.showAlert = false
      clearInterval(this.progressInterval)
    }, totalDuration)
  }

  closeAlert(): void {
    this.showAlert = false
    clearInterval(this.progressInterval)
  }
}
