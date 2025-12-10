import { Component, OnInit } from '@angular/core';
import  { Navbar } from '../../layout/navbar/navbar';
import  {PostComponent}  from  '../../shared/components/post/post'  ;
import { fetchPosts } from '../../core/services/post.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar , PostComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent  {
  protected posts  =  fetchPosts()  ;

  constructor(){
            
  }
 
}
