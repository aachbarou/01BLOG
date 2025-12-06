import { Component  } from '@angular/core';
import  { isPlatformBrowser , isPlatformServer } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Inject , PLATFORM_ID } from '@angular/core';
import { Loading } from './shared/components/loading/loading' ;
import { ChangeDetectorRef } from '@angular/core' ;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet , Loading ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(  @Inject(PLATFORM_ID) private platformId: Object , private  cdr :ChangeDetectorRef) {}
  protected   isLoading  = true   ; 
  ngOnInit(): void {
    if  (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.isLoading = false ;
          this.cdr.detectChanges() ;
        } , 1000 );
    }
  }
  title: string = "01BLOG"

 
}
