import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth.service';
import {  UserRegister } from '../../../core/models/user.model';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registre.html',
  styleUrl: './registre.css'
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthServices) {}
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  register() {
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    const user: UserRegister = {
      username: this.name,
      email: this.email,
      password: this.password,
      confirmPassword  : this.confirmPassword ,
    };

    alert('Registering user: ' + JSON.stringify(user));
    this.authService.register(user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.message || 'Registration failed');
        this.error = err.message || 'Registration failed';
        console.error('----------------------------------------Registration failed', err);
      }
    });
  }

  onSignupClick() {
    this.router.navigate(['/login']);
  }
}
