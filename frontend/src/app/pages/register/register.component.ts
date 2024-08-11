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
      password: ['', Validators.required],
    })
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const { email, password, first_name, last_name } = this.contactForm.value
      this.authService.register(email, password, first_name, last_name).subscribe(
        response => {
          console.log('Registration successful', response)
          this.router.navigateByUrl('/')
        },
        error => {
          this.errorMessage = error.error.error || 'An error occurred'
          console.error('Registration error', error)
        },
      )

      this.contactService.sendRegisterEmail(this.contactForm.value).subscribe(
        response => {
          alert('Correo enviado exitosamente')
          this.contactForm.reset()
        },
        error => {
          alert('Error al enviar el correo')
        },
      )
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login')
  }
}
