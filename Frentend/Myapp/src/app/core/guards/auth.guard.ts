import  { CanActivate, Router, UrlTree  } from  '@angular/router'  ;
import { AuthServices } from '../services/auth.service';
import {  Injectable } from '@angular/core' ;
@Injectable({
    providedIn : 'root' 
})

export  class  AutGuard  implements CanActivate {
        constructor( private Auth : AuthServices ,   private router : Router  ){
        }
        canActivate(): boolean | UrlTree {
           if  (this.Auth.isLoggedIn() &&  this.checkToken() ) {
                 return  true 
           }else  {
                this.RemoveToken( ) ;
               return   this.router.createUrlTree(['/login'])
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