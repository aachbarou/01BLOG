import { CanActivate, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Import Inject and PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser
@Injectable({
  providedIn: 'root'
})
export class AutGuard implements CanActivate {
  constructor(
    private Auth: AuthServices,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}


  canActivate(): any {
    if (!isPlatformBrowser(this.platformId)) return true;
    const token = localStorage.getItem('token');

    this.Auth.validateTokenOnServer().subscribe({
        next: (response) => {
          return true;
        },
        error: (err) => {
          this.RemoveToken();
          this.router.navigate(['/login']);
        }
      });
   
  }

  checkToken(): boolean {
      const token = localStorage.getItem('token');
      return token !== null && token.length > 0;
  }

  RemoveToken() {
    this.Auth.logoutSet();
  }
}