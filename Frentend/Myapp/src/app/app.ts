import { Component, signal } from '@angular/core';
import { LoginComponent } from './features/auth/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 title:string =  "01BLOG"
  isLoggedIn = false  ;
  
  loginSuccess() {
    this.isLoggedIn = true  ; 
  }
}
