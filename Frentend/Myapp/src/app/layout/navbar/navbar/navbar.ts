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
  protected logout(){
    // Implement logout functionality here
    this.router.navigate(['/login']);
  }
  rerender(){
    // Implement rerender functionality here
    console.log('rerender Home  page');
    this.router.navigate(['/home']);
  }
}
