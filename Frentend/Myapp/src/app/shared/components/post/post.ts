import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { CommentComponent } from '../comment/comment';
import { UserService } from '../../../core/services/user.service';
import { PostService } from '../../../core/services/post.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentComponent],
  templateUrl: './post.html',
  styleUrl: './post.css'
})
export class PostComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  
  showComments = false;
  showOptions = false;
  isLiked = false;
  isOwner = false;
  newCommentText = '';

  mockComments: Comment[] = [];

  constructor(
    private router: Router, 
    private userService: UserService, 
    private postService: PostService ,
    private http: HttpClient ,
    private  cdn : ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      if (user && this.post.user) {
        this.isOwner = user.id === this.post.user.user_id;
      }
    });
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/files/${url}`;
  }

  isLoadingComments = false;

  toggleComments() {
    this.showComments = !this.showComments;

    if (this.showComments ) {
      this.fetchComments();
    }
  }

  fetchComments() {
    this.isLoadingComments = true;
    this.getComments(this.post.id).subscribe({
      next: (response) => {
        this.mockComments = response.data;
        this.isLoadingComments = false;
        this.cdn.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
        this.isLoadingComments = false;
      }
    });
  }
  
  toggleOptions(event: Event) {
    event.stopPropagation();
    this.showOptions = !this.showOptions;
  }
  getComments(postId: number): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(`http://localhost:8080/api/comments/post/${postId}`, { headers: this.getHeaders() });
  }
  sendComment() {
    if (!this.newCommentText.trim()) return;

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.newCommentText;

    this.http.post<ApiResponse<any>>(`http://localhost:8080/api/comments/post/${this.post.id}`, body, { headers })
      .subscribe({
        next: (response) => {
          const newCommentFromServer = response.data;
          
          const mappedComment: Comment = {
            id: newCommentFromServer.id.toString(),
            postId: this.post.id.toString(),
            authorName: newCommentFromServer.user.username,
            authorAvatar: "" ,
            content: newCommentFromServer.content,
            timestamp: new Date(newCommentFromServer.timestamp),
            user : {
              role : newCommentFromServer.user.role,
              id: newCommentFromServer.user.id,
              username: newCommentFromServer.user.username,
              email: newCommentFromServer.user.email
            }
          };

          this.newCommentText = ''; 
          this.mockComments.push(mappedComment);
          if (this.post.comments !== undefined) {
            this.post.comments++;
          }
          this.cdn.detectChanges();
        },
        error: (err) => console.error('Failed to send comment', err)
      });
}

  onEdit() { this.router.navigate(['/edit-post', this.post.id]); }

  onDelete() {


    if(this.isOwner){
      if(confirm('Delete permanently?')) {
        this.postService.deletePost(this.post.id).subscribe(() => window.location.reload());
      }
    }
    else{
      alert('You are not authorized to delete this post');
    }
    
  }

  serveProfile(id?: number) { this.router.navigate(['/profile', id]); }

  @HostListener('document:click')
  closeOptions() { this.showOptions = false; }
}