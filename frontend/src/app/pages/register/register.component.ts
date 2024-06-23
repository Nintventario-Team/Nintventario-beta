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
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  first_name: string = '';
  last_name: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService
      .register(this.email, this.password, this.first_name, this.last_name)
      .subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigateByUrl('/');
        },
        (error) => {
          this.errorMessage = error.error.error || 'An error occurred';
          console.error('Registration error', error);
        }
      );
  }
  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }
}
