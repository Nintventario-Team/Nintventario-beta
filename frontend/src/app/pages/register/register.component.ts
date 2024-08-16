/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ContactService } from '../../services/contact.service'
import { CommonModule } from '@angular/common'
import { AlertComponent } from '../../shared/alert/alert.component'
import { AlertService } from '../../services/alert.service'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule, AlertComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  contactForm: FormGroup
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {
    this.contactForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const { email, password, first_name, last_name } = this.contactForm.value
      this.authService.register(email, password, first_name, last_name).subscribe(
        response => {
          console.log('Registration successful', response)
          this.alertTopic = 'Creación de cuenta exitosa'
          this.alertMessage = 'La cuenta ha sido creada exitosamente.'
          this.alertType = 'verify'
          this.alertComponent.resetAlert()
          this.contactService.sendRegisterEmail(this.contactForm.value).subscribe(
            response => {
              console.log('Email sent', response)
            },
            error => {
              console.error('Email error', error)
            },
          )
          this.alertService.setAlert(this.alertTopic, this.alertMessage, this.alertType)
          this.router.navigateByUrl('/')

        },
        error => {
          if (error.error.error === 'Email already exists') {
            this.alertTopic = 'Error al crear cuenta'
            this.alertMessage = 'El correo ya está registrado.'
            this.alertType = 'error'
            this.alertComponent.resetAlert()
          } else {
            this.alertTopic = 'Error al crear cuenta'
            this.alertMessage = 'Ocurrió un error durante el registro.'
            this.alertType = 'error'
            this.alertComponent.resetAlert()
          }
          console.error('Registration error', error)
        },
      )
    } else {
      this.alertTopic = 'Error al crear cuenta'
      this.alertMessage = 'Porfavor rellena todos los campos.'
      this.alertType = 'error'
      this.alertComponent.resetAlert()
      this.contactForm.markAllAsTouched()
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }
}
