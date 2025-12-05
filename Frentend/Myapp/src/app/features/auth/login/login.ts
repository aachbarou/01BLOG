import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  host: { 'class': 'center-content' }
})
export class LoginComponent {
  constructor(private router: Router) { }

  email = '';
  password = '';
  public LoginError = false;
  protected ErrorMessage = '';

  login() {
    if (!this.email || !this.password) {
      this.LoginError = true;
      this.ErrorMessage = 'Please enter both email and password.';

      setTimeout(() => {
        this.LoginError = false;
        console.log(this.LoginError);
        let errelem = document.getElementById('error-message');
        if (errelem) {
          console.log('Hiding error message element');
          errelem.classList.add('hidden');
        }
      }, 1000);
    } else {
      // Simulate successful login
      this.LoginError = false;
      this.ErrorMessage = '';
      console.log('Login successful');
    }
  }
  showregister() {

    this.router.navigate(['/signup']);
  }
  resetpass() {
    console.log("hhh ana hna kankhera ");
    
    this.router.navigate(['/help']);
  }


}
