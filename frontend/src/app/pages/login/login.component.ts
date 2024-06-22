import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginResponse } from '../../interfaces/user';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: LoginResponse) => {
        console.log('Login successful', response);
        const accessToken = response.access;
        localStorage.setItem('accessToken', accessToken);
        this.router.navigateByUrl('/');
      },
      error => {
        this.errorMessage = 'Invalid credentials';
        console.error('Login error', error);
      }
    );
  }
  
  
  navigateToRegister() {
    this.router.navigateByUrl('/register');
  }
  
  
}
