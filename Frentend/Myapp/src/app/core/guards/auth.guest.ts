import { Injectable } from '@angular/core';
import  { CanActivate, Router, UrlTree  } from  '@angular/router'  ;
import { AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuest implements CanActivate {
    constructor( private Auth : AuthServices  , private router : Router  ){
        }
        canActivate(): boolean | UrlTree  {
           if  (this.Auth.isLoggedIn()){
                return   this.router.createUrlTree(['/home'])
           }
               return true ;
                
        }
}
