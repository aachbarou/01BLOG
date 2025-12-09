import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn : 'root'
})
export  class AuthServices {
  private logged = new BehaviorSubject<boolean>(false );
    Isloged$ =   this.logged.asObservable() ;
    login() {
    this.logged.next(true);
  }

  logout() {
    this.logged.next(false);
  }

  isLoggedIn(): boolean {
    return this.logged.value;
  }

}