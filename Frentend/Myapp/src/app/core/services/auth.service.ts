import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthServices {

  private logged = new BehaviorSubject<boolean>(false);
  Isloged$ = this.logged.asObservable();
  private lastValue: string | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    const initial = this.getLocalStorageValue();
    this.logged.next(initial);
    if (isPlatformBrowser(this.platformId)) { 
    this.lastValue = localStorage.getItem('logged');
    }

    setInterval(() => this.checkLocalStorage(), 1000); 
  }
  private getLocalStorageValue(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('logged');
      if (!saved) {
        localStorage.setItem('logged', 'false');
        return false;
      }
      return saved === 'true';
    }
    return false;
  }

  private checkLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const current = localStorage.getItem('logged');
      if (current !== this.lastValue) {
        this.lastValue = current;
        this.logged.next(current === 'true');
      }
    }
  }

  loginSet() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('logged', 'true');
    }
    this.logged.next(true);
  }

  logoutSet() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('logged', 'false');
    }
    this.logged.next(false);
  }

  isLoggedIn(): boolean {
    return this.logged.value;
  }
}
