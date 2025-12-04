import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  // @Output() loginSuccess = new EventEmitter<void>();
  username = '';
  password = '';
  ;
  
  login() {
    // For now, just log to the console
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    // this.loginSuccess.emit();
  }
}
