import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private router:Router){}
  ShowProfile(){
    this.router.navigate(['/profile']);
  }
  protected  imageUrl:string = 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png';
  protected userName:string = 'John Doe';
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
