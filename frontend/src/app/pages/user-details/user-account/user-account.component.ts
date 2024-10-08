import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from '../../../services/auth.service'
import { User } from '../../../interfaces/user'

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})

export class UserAccountComponent {
  userInfo: User | undefined

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/')
  }

  ngOnInit(): void {
    if (this.authService.checkLoginStatus()) {
      this.authService.getUserInfo().subscribe(
        (data: User) => {
          this.userInfo = data
        },
        (error: unknown) => {
          console.error('Error fetching user info:', error)
        },
      )
    } else {
      console.error('User not authenticated')
    }
  }
}
