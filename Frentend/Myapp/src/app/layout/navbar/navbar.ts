import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AutGuard } from '../../core/guards/auth.guard';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
@Injectable({
  providedIn : 'root'
})
export class Navbar {
  constructor(private router:Router , private Auth  : AutGuard){
    
  }
  username: string = 'Simo 6'; 
  ShowProfile(){
    this.Auth.canActivate(); 
    this.router.navigate(['/profile']);
  }
  protected  imageUrl:string = 'https://upload.wikimedia.org/wikipedia/ary/8/88/Lmorphine.jpg'
  protected profileToggle(){
    this.router.navigate(['/profile']);
  }
  rerender(){
    console.log('rerender Home  page');
    this.router.navigate(['/home']);
  }
}
