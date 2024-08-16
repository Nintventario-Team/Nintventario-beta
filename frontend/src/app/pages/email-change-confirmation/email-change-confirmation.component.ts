import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'

@Component({
  selector: 'app-email-change-confirmation',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertComponent],
  templateUrl: './email-change-confirmation.component.html',
  styleUrl: './email-change-confirmation.component.css',
})
export class EmailChangeConfirmationComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  email: string = ''
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
    this.authService.requestPasswordReset(this.email).subscribe(
      response => {
        console.log('Reset link sent successfully', response)
        this.alertTopic = 'Correo enviado'
        this.alertMessage = 'Revisa tu correo para el enlace de restablecimiento de contraseña.'
        this.alertType = 'verify'
        this.alertComponent.resetAlert()
        this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
      },
      error => {
        this.alertTopic = 'Error al enviar enlace'
        this.alertMessage = 'No se pudo enviar el enlace de restablecimiento. Intenta nuevamente.'
        this.alertType = 'error'
        this.alertComponent.resetAlert()
        console.error('Reset link error', error)
      },
    )
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }
}
