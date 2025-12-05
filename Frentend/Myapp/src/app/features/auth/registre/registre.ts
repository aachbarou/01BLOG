import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registre',
  imports: [FormsModule],
  
  templateUrl: './registre.html',
  styleUrl: './registre.css',
})
export class RegisterComponent {
  @Output() SwitchToLoginClick = new EventEmitter<void>();
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
 onSignupClick(event?: Event) {
   // 2. Press the button (Send the signal)
   
   this.SwitchToLoginClick.emit();
}

}
