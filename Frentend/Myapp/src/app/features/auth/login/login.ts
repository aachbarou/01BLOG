import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { afterNextRender } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  @Output() emitedResult = new EventEmitter<void>();
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
        // this.ErrorMessage = '';
        console.log(this.LoginError);
        // hide the error after 1 second
        let errelem  = document.getElementById('error-message');
        if (errelem) {
          console.log('Hiding error message element');
          errelem.classList.add('hidden');
        }
      }, 1000);


  } else {
    this.emitedResult.emit();
  }
}
}
