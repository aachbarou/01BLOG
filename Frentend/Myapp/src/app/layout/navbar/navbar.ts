import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router:Router){}
  username: string = 'Simo 6'; 
  ShowProfile(){
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
