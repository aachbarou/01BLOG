import { Component } from '@angular/core';
import  { Navbar } from '../../layout/navbar/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  
}
