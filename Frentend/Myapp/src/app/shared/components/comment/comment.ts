import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../core/models/comment.model';
import { PostService } from '../../../core/services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css'
})
export class CommentComponent {
  @Input({ required: true })  comment!: Comment;
  public postservice : PostService ;
  private router : Router ; 
  constructor( postservice : PostService , private rrouter : Router ) {
    this.postservice = postservice ;
    this.router = rrouter ;

  }
  serveProfile(id?: number) { this.router.navigate(['/profile', id]); }
}