import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser , isPlatformServer } from '@angular/common';
import { Inject , PLATFORM_ID } from '@angular/core';
@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {
  constructor(private router:Router ){} ;
    loadingMessage: string = 'Loading Something...';

}
