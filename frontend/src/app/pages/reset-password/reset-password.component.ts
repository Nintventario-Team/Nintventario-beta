/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  resetForm: FormGroup
  uid: string = ''
  token: string = ''
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.uid = params['uid']
      this.token = params['token']
    })
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')
    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true }
    }
    return null
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const password = this.resetForm.get('password')?.value
      this.authService.resetPassword(this.uid, this.token, password).subscribe(
        response => {
          this.alertTopic = 'Contraseña restablecida'
          this.alertMessage = 'Contraseña restablecida con éxito.'
          this.showAlert = true
          this.alertType = 'verify'
          this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
          this.router.navigateByUrl('/login')
        },
        error => {
          this.alertTopic = 'Error al restablecer contraseña'
          this.alertMessage = 'Error al restablecer la contraseña. Intenta nuevamente.'
          this.showAlert = true
          this.alertType = 'error'
          console.error('Reset password error', error)
        },
      )
    } else if (this.resetForm.errors?.['passwordMismatch']) {
      this.alertTopic = 'Error'
      this.alertMessage = 'Las contraseñas no coinciden.'
      this.showAlert = true
      this.alertType = 'error'
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }
}
