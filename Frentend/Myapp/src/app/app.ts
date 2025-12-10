import { Component, Inject, Injectable, OnInit  } from '@angular/core';
import { RouterOutlet, UrlTree } from '@angular/router';
import  { Router } from  '@angular/router'  ;
import { ChangeDetectorRef } from '@angular/core' ;
import  {Loading} from  './shared/components/loading/loading'  ;
import { Event as EventType , NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router' ;
import { AutGuard } from './core/guards/auth.guard';
import  {AuthServices} from './core/services/auth.service'
import { Navbar } from './layout/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet , Loading , Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected  isLoading = true    ;
  constructor( 
    private cdr: ChangeDetectorRef, 
    private router: Router, 
    private  Auths : AuthServices 
  ) {
   
  }
  
  ngOnInit(): void {
    
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
  Islooged():boolean {
    // console.log('hhhhh')
     return  this.Auths.isLoggedIn()  ;
  }
}
