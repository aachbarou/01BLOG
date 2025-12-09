import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import  {AuthServices} from  '../../../core/services/auth.service'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , Loading],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router , authservice  : AuthServices) {
   }
  isLoading: boolean = false;

  email = '';
  password = '';
  public LoginError = false;
  protected ErrorMessage = '';

  login() {
    if (!this.email || !this.password) {
      this.LoginError = true;
      this.ErrorMessage = 'Please enter both email and password.';

     this.authservice.login();
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
    
    this.router.navigate(['/help']);
  }


}
