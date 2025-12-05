import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
// import { afterNextRender } from '@angular/core';
//import {RegisterComponent} from '../registre/registre';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  @Output() loginToregister =  new EventEmitter<void>();
  @Output() loginSuccessemiter = new EventEmitter<void>();
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
        let errelem  = document.getElementById('error-message');
        if (errelem) {
          console.log('Hiding error message element');
          errelem.classList.add('hidden');
        }
      }, 1000);
  }else  {
    // Simulate successful login
    this.LoginError = false;
    this.ErrorMessage = '';
    console.log('Login successful');
    this.loginSuccessemiter.emit();
  }
}
showregister(){
  
  this.loginToregister.emit();
}


}
