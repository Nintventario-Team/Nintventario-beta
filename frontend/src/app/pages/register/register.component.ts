import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  password2: string = '';
  first_name: string = '';
  last_name: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    if (this.password !== this.password2) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.email, this.password, this.password2, this.first_name, this.last_name).subscribe(
      response => {
        console.log('Registration successful', response);
        // Aquí puedes redirigir al usuario a otra página, por ejemplo, al login
      },
      error => {
        this.errorMessage = error.error.error || 'An error occurred';
        console.error('Registration error', error);
      }
    );
  }
  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

}
