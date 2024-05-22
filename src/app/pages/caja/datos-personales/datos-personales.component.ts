import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [RouterLinkActive, RouterLink ],
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent {

}
