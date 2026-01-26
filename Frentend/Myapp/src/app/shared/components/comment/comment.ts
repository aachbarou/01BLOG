import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../core/models/comment.model';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.html',
  styleUrl: './comment.css'
})
export class CommentComponent {
  @Input({ required: true }) comment!: Comment;
  public postservice : PostService ;
  constructor( postservice : PostService) {
    this.postservice = postservice ;
  }
}