import { Component, Inject, Injectable  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  { Router } from  '@angular/router'  ;
import { ChangeDetectorRef } from '@angular/core' ;
import  {Loading} from  './shared/components/loading/loading'  ;
import { Event as EventType , NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router' ;
import  {AutGuard} from  '../app/core/guards/auth.guard'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet , Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected  isLoading = true    ;
  constructor( private   cdr  : ChangeDetectorRef   , private  router :  Router , private Auth : AutGuard ) {
         this.Auth.canActivate();
        this.router.events.subscribe((event : EventType) => {
         if  (event  instanceof  NavigationStart ) {
            this.isLoading = true  ;
            this.cdr.detectChanges()  ;
          }
         if  ( event  instanceof  NavigationEnd  || event  instanceof  NavigationCancel  || event  instanceof  NavigationError ) {
          console.log("Navigation Ended")  ;
            setTimeout( ()  =>  {
              this.isLoading = false  ;
              
              this.cdr.detectChanges()  ;
            }  ,  1000 )  ;
         }
        });
        
  }
  
 
 
}
