import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth.service';
import { UserLogin } from '../../../core/models/user.model';
import { AuthFieldErrors, validateAuthFields, isValid } from '../../../shared/utils/auth-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router, private Auths: AuthServices, private cdn: ChangeDetectorRef) { }

  isLoading = false;
  email = '';
  password = '';
  public LoginError = false;
  protected ErrorMessage = '';
  errors: AuthFieldErrors = {};

  login() {
    // Run shared validation
    this.errors = validateAuthFields('login', {
      email: this.email,
      password: this.password
    });

    if (!isValid(this.errors)) {
      return; // stop – template will show per-field errors
    }

    this.isLoading = true;
    this.LoginError = false;

    const userlogin: UserLogin = {
      email: this.email,
      password: this.password
    };

    this.Auths.login(userlogin).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.Auths.loginSet(response.data.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        this.LoginError = true;
        this.ErrorMessage = error.error?.message || 'Login failed. Please try again.';
        this.cdn.detectChanges();
      }
    });
  }

  showregister() {
    this.router.navigate(['/signup']);
  }

}
