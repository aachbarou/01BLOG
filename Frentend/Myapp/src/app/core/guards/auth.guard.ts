import  { CanActivate, Router, UrlTree  } from  '@angular/router'  ;
import { AuthServices } from '../services/auth.service';
import {  Injectable } from '@angular/core' ;
@Injectable({
    providedIn : 'root' 
})

export  class  AutGuard  implements CanActivate {
        constructor( private Auth : AuthServices  , private router : Router  ){
        }
        canActivate(): boolean | UrlTree {
           if  (this.Auth.isLoggedIn()){
                 return  true 
           }else  {
               return   this.router.createUrlTree(['/login'])
                
           }
        }
       
        

}