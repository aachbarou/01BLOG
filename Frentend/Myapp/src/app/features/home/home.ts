import { Component, OnInit } from '@angular/core';
import  {PostComponent}  from  '../../shared/components/post/post'  ;
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ PostComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(posts => {
      this.posts = posts;
    });
  }
}
