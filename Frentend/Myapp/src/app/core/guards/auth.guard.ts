import { CanActivate, Router, UrlTree } from '@angular/router';
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

  canActivate(): boolean | UrlTree {
    //  to  avoid  the  server  Side rendering 
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    if (this.Auth.isLoggedIn() && this.checkToken()) {
      return true;
    } else {
      this.RemoveToken();
      return this.router.createUrlTree(['/login']);
    }
  }

  checkToken(): boolean {
      const token = localStorage.getItem('token');
      return token !== null && token.length > 0;
  }

  RemoveToken() {
    this.Auth.logoutSet();
  }
}