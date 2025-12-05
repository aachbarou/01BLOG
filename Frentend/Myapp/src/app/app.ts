import { Component, signal } from '@angular/core';
import { LoginComponent } from './features/auth/login/login';
// import { routes } from './app.routes';

import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent, NgIf, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 title:string =  "01BLOG"
  isLoggedIn = false  ;
  
  loginsuccess() {
    this.isLoggedIn = true  ; 
  }
}
