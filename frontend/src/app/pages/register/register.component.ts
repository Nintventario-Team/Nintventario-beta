/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ContactService } from '../../services/contact.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  contactForm: FormGroup
  errorMessage: string = ''
  alertMessage: string = ''
  showAlert: boolean = false
  alertClass: string = ''
  progressWidth: number = 100
  progressColor: string = ''
  progressInterval: any
  alertTimeout: any

  constructor(
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
          this.showAlertMessage('Registro exitoso', 'success')

          this.contactService.sendRegisterEmail(this.contactForm.value).subscribe(
            response => {
              alert('Correo enviado exitosamente')
              this.contactForm.reset()
            },
            error => {
              alert('Error al enviar el correo')
            },
          )

          this.router.navigateByUrl('/')
        },
        error => {
          if (error.error.error === 'Email already exists') {
            this.showAlertMessage('Este correo ya tiene una cuenta registrada', 'error')
          } else {
            this.showAlertMessage('Ocurrió un error durante el registro', 'error')
          }
          console.error('Registration error', error)
        },
      )
    } else {
      this.showAlertMessage('Por favor, completa todos los campos correctamente', 'error')
      this.contactForm.markAllAsTouched() 
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }

  showAlertMessage(message: string, type: string): void {
    this.alertMessage = message
    this.showAlert = true
    this.progressWidth = 100

    if (type === 'success') {
      this.alertClass = 'alert-success'
      this.progressColor = '#4CAF50'
    } else {
      this.alertClass = 'alert-error'
      this.progressColor = '#f44336'
    }

    clearInterval(this.progressInterval)
    clearTimeout(this.alertTimeout)

    const totalDuration = 7000
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
