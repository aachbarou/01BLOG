import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Loading } from '../../../shared/components/loading/loading';
import  {AutGuard} from  '../../../core/guards/auth.guard'
import  {AuthServices} from  '../../../core/services/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , Loading],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router , private Auths : AuthServices , private  AuthGard  : AutGuard) {
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
      // Simulate successful login
      this.LoginError = false;
      this.ErrorMessage = '';
       this.Auths.loginSet();
      

      this.router.navigate(['/home'])

      
    }
  }
  showregister() {
    this.router.navigate(['/signup']);
  }
  resetpass() {
    this.router.navigate(['/help']);
  }


}
