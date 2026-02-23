import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth.service';
import { UserRegister } from '../../../core/models/user.model';
import { AuthFieldErrors, validateAuthFields, isValid } from '../../../shared/utils/auth-validators';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registre.html',
  styleUrl: './registre.css'
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthServices, private cdn: ChangeDetectorRef) { }

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  errors: AuthFieldErrors = {};

  register() {
    // Run shared validation
    this.errors = validateAuthFields('register', {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      name: this.name
    });

    if (!isValid(this.errors)) {
      return; // stop – template will show per-field errors
    }

    const user: UserRegister = {
      username: this.name,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.cdn.detectChanges();
      }
    });
  }

  onSignupClick() {
    this.router.navigate(['/login']);
  }
}
