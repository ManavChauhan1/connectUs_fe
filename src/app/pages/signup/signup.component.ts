import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [CommonModule, FormsModule]
})
export class SignupComponent {
  form = {
    name: '',
    username: '',
    age: '',
    email: '',
    password: ''
  };

  // constructor(private router: Router) {}
  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    console.log(this.form);
    this.api.register(this.form).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => console.error(err)
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

}
