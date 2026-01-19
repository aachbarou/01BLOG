import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { CommentComponent } from '../comment/comment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './post.html',
  styleUrls: ['./post.css']
})
export class PostComponent implements OnChanges {
  constructor(private router: Router) {}
  @Input({ required: true }) post!: Post;
  
  showComments = false;
  isLiked = false;
  newCommentText = '';
  
  mockComments: Comment[] = [
    {
      id: 'c1',
      postId: '1',
      authorName: "John Doe",
      authorAvatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      content: "This is a great insight into 2024 trends! I really think AI frameworks will dominate.",
      date: new Date()
    },
    {
      id: 'c2',
      postId: '1',
      authorName: "Emily Chen",
      authorAvatar: "https://ui-avatars.com/api/?name=Emily+Chen&background=random",
      content: "Totally agree! The performance gains in server components are hard to ignore.",
      date: new Date()
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && this.post) {
      this.post.mediaUrl = this.getMediaUrl(this.post.mediaUrl);
    }
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/files/${url}`;
  }
  serveProfile(id?: number) {
    this.router.navigate(['/profile', id]);
}

}