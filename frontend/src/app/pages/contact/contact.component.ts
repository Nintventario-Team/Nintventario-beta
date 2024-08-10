/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { ContactService } from '../../services/contact.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup

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
          alert('Correo enviado exitosamente')
          this.contactForm.reset()
        },
        error => {
          alert('Error al enviar el correo')
        },
      )
    }
  }
}
