import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = {
    email: '',
    password: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  onLogin(): void {
    console.log('Login Form Submitted:', this.form);

    this.api.login(this.form).subscribe({
      next: (res) => {
        // console.log('Login successful:', res);
        // console.log("token:", res.token);
        localStorage.setItem('token', res.token); //Setting Cookie in browser
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert(err.error?.message ||'Login failed. Please check your credentials.');
      }
    });
  }

  redirectToSignup() {
  this.router.navigate(['/']);
}
}
