import { Injectable, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthServices  {
  constructor(@Inject(PLATFORM_ID) private platformId: object ) {
    this.getlocalstoragev()
  }
 
  private logged = new BehaviorSubject<boolean>(false );
  Isloged$ = this.logged.asObservable();
  
  private getlocalstoragev(): void  {
    if  (isPlatformBrowser(this.platformId)){
       const saved  = localStorage.getItem('logged');
      if (!saved) {
           localStorage.setItem('logged', 'false');
      }else  {
        if (saved === 'true'){
            this.logged.next(true) ;
        }else  {
          this.logged.next(false) ;
        }
      }
    }
  }
  loginSet() {
    if  ( isPlatformBrowser(this.platformId)){
              localStorage.setItem('logged', 'true');
    }
    this.logged.next(true);
  }

  logoutSet() {
    if (isPlatformBrowser(this.platformId)){
      localStorage.setItem('logged', 'false');
      
    }
    this.logged.next(false);
  }

  isLoggedIn(): boolean {
    return this.logged.value;
  }

}