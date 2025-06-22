import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterSchema } from '../../zod-schemas/register.schema';

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

    const result = RegisterSchema.safeParse(this.form);
    if (!result.success) {
      //Showing the First error
      const firstError = result.error.issues[0]?.message || 'Invalid input';
      alert(firstError);
      return;
    }

    const { name, email, username, age, password } = this.form;

    if (!name || !email || !username || !age || !password) {
      alert('Please fill in all the fields.');
      return;
    }

    this.api.register(this.form).subscribe({
      next: (res) => {
        console.log("Registration Successful..:", res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/profile'])
      },
      error: (err) => {
        console.log("Here")
        console.error(err)
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
