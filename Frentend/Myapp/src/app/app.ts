import { Component } from '@angular/core';
import { LoginComponent } from './features/auth/login/login';
// import { routes } from './app.routes';

import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './features/auth/registre/registre';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, RouterOutlet , RegisterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title: string = "01BLOG"
  isLoggedIn = false;
  registerView  =  false  ;
  loginsuccess() {
    
    this.isLoggedIn = true;
  
  }
  toggleRegisterView(Showit: boolean) {
    console.log('Register view toggled:', this.registerView);

    this.registerView = Showit;
  }

  
}
