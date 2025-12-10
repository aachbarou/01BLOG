import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AutGuard } from '../../core/guards/auth.guard';
import  {AuthServices} from  '../../core/services/auth.service' 

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
  constructor(private router:Router , private Auth  : AutGuard  , private   Auths : AuthServices ){
    
  }
  username: string = 'Simo 6'; 
  ShowProfile(){
    this.router.navigate(['/profile']);
  }
  protected  imageUrl:string = 'https://upload.wikimedia.org/wikipedia/ary/8/88/Lmorphine.jpg'
  protected profileToggle(){
    this.router.navigate(['/profile']);
  }
  rerender(){
    
    this.router.navigate(['/home']);
  }
  logout(){
      this.Auths.logoutSet();
      this.router.navigate(['/login'])
  }
}
