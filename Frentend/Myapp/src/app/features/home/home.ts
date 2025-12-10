import { Component } from '@angular/core';
import  {PostComponent}  from  '../../shared/components/post/post'  ;
import { fetchPosts } from '../../core/services/post.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ PostComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent  {
  protected posts  =  fetchPosts()  ;

  constructor(){
            
  }
 
}
