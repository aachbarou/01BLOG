import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostComponent } from '../../shared/components/post/post';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { PostService } from '../../core/services/post.service';
import { Post } from '../../core/models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PostComponent, EmptyStateComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService, private router: Router, private cdn: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.postService.getPosts().subscribe({
      next: (response) => {
        this.posts = response.data
        this.cdn.detectChanges();
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }
  goCreate() {
    this.router.navigate(['/create-post']);
  }

}
