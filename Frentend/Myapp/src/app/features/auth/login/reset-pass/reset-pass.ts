import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-reset-pass',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-pass.html',
  styleUrl: './reset-pass.css',
})
export class ResetPass {
  constructor(private router: Router) {}
  email: string = '';
  message: string = '';
  messageType = '';

  resetPassword() {
    alert('Password reset link sent to'+  this.email);
  }
  sendResetLink(){
    if (!this.email) {
      this.messageType = 'error';
      this.message = 'Please enter your email address.';
    } else {
      this.messageType = 'success';
      this.message = 'A password reset link has been sent to your email.';
    }
  }
  backToLogin(){
    this.router.navigate(['/login']);
  }
}
