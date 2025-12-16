import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import  {AuthServices} from  '../../../core/services/auth.service'
import { UserLogin } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router , private Auths : AuthServices ) {
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
    } else {
      const userlogin : UserLogin = {
        email : this.email ,
        password : this.password
      };
      this.Auths.login(userlogin).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.Auths.loginSet( response.token);
        
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.LoginError = true;
          this.ErrorMessage = error.error.message || 'Login failed. Please try again.';
        }
      })
    }
  }
  showregister() {
    this.router.navigate(['/signup']);
  }
  resetpass() {
    this.router.navigate(['/help']);
  }


}
