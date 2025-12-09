import  { CanActivate, Router } from  '@angular/router'  ;
import { AuthServices } from '../services/auth.service';
import {  Injectable } from '@angular/core' ;

@Injectable({
    providedIn : 'root' 
})

export  class  AutGuard implements CanActivate{
        constructor( private Auth : AuthServices  , private router : Router  ){}
        canActivate():boolean{
            if (!this.Auth.isLoggedIn()){
                this.router.navigate(['/login'])
                return  false  ;
            }
            return  true
        }
}