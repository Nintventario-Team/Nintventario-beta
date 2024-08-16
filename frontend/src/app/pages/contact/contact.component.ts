/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ContactService } from '../../services/contact.service'
import { CommonModule } from '@angular/common'
import { AlertComponent } from '../../shared/alert/alert.component'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, AlertComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent
  contactForm: FormGroup
  showAlert = false
  alertTopic = ''
  alertType: 'verify' | 'error' | 'confirm' = 'verify'
  alertMessage = ''

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {
    this.contactForm = this.fb.group({
      cedula: ['', Validators.required],
      nombres: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ciudad: [''],
      asunto: ['', Validators.required],
      comentario: ['', Validators.required],
    })
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactService.sendContactEmail(this.contactForm.value).subscribe(
        response => {
          this.alertTopic = 'Correo enviado'
          this.alertMessage = 'El correo ha sido enviado exitosamente.'
          this.alertType = 'verify'
          this.alertComponent.resetAlert()
          this.contactForm.reset()
        },
        error => {
          this.alertTopic = 'Error al enviar correo'
          this.alertMessage = 'Hubo un error al enviar el correo. Por favor, inténtelo de nuevo.'
          this.alertType = 'error'
          this.alertComponent.resetAlert()
        },
      )
    } else {
      this.contactForm.markAllAsTouched()
    }
  }
}
