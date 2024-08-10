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
  email: string = ''
  password: string = ''
  first_name: string = ''
  last_name: string = ''
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
    })
  }

  onSubmit(): void {
    this.authService.register(this.email, this.password, this.first_name, this.last_name).subscribe(
      response => {
        console.log('Registration successful', response)
        this.router.navigateByUrl('/')
      },
      error => {
        this.errorMessage = error.error.error || 'An error occurred'
        console.error('Registration error', error)
      },
    )
    if (this.contactForm.valid) {
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
