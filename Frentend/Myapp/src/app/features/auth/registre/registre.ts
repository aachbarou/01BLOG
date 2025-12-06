import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import  { Router } from '@angular/router';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registre.html',
  styleUrl: './registre.css'
})
export class RegisterComponent {
 constructor(private router: Router) {}
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  register(){
    // Registration logic here
    if  (this.password !== this.confirmPassword) {
      console.log( 'Passwords do not match');
      return;
    }
    console.log('Registration successful for', this.name, this.email);
    
  }
  onSignupClick(){
    this.router.navigate(['/login']);
  }

}
