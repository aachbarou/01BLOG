import { Component, OnInit } from '@angular/core';
import  {PostComponent}  from  '../../shared/components/post/post'  ;
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ PostComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService  , private router: Router ) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      // this.posts = posts;
      next: (response) => {
          console.log('Login successful:', response);
          this.posts =  response 
          alert(this.posts)
        },
        error: (error) => {
          console.error('Login failed:', error);
          // alert(this.posts)
          // this.router.navigate(["/login"])
        }
    });
  }
}
