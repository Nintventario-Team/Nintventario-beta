import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-metodo-pago',
  standalone: true,
  imports: [RouterLinkActive, RouterLink,CommonModule,FormsModule],
  templateUrl: './metodo-pago.component.html',
  styleUrl: './metodo-pago.component.css',
})
export class MetodoPagoComponent {
  checkbox1: boolean = false;
  checkbox2: boolean = false;
showForm2: boolean = false;
showForm1: boolean = false;
  verifySelection(checkboxNumber: number) {
    // Desseleccionar el otro checkbox
    if (checkboxNumber === 1) {
      this.checkbox2 = !this.checkbox1;
      this.showForm1 = true;
      this.showForm2 = false;

    } else if (checkboxNumber === 2) {
      this.checkbox1 = !this.checkbox2;
      this.showForm1 = false;
      this.showForm2 = true;

    }
  }
}
