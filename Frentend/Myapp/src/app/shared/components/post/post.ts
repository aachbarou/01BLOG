import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { Comment } from '../../../core/models/comment.model';
import { CommentComponent } from '../comment/comment';
import { UserService } from '../../../core/services/user.service';
import { PostService } from '../../../core/services/post.service';

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

  // بيانات وهمية للتعليقات
  mockComments: Comment[] = [
    {
      id: 'c1',
      postId: '1',
      authorName: "John Doe",
      authorAvatar: "https://ui-avatars.com/api/?name=John+Doe",
      content: "Great technical insight!",
      date: new Date()
    }
  ];

  constructor(
    private router: Router, 
    private userService: UserService, 
    private postService: PostService
  ) {}

  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      if (user && this.post.user) {
        this.isOwner = user.id === this.post.user.user_id;
      }
    });
  }

  // دالة المساعدة لتحويل اسم الملف لرابط كامل دون تعديل البيانات الأصلية
  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    // إذا كان الرابط كاملاً بالفعل، أرجعه كما هو
    if (url.startsWith('http')) return url;
    // أضف مسار الخادم لأسماء الملفات المرفوعة فقط
    return `http://localhost:8080/files/${url}`;
  }

  toggleComments() { this.showComments = !this.showComments; }
  
  toggleOptions(event: Event) {
    event.stopPropagation();
    this.showOptions = !this.showOptions;
  }

  sendComment() {
    if (this.newCommentText.trim()) { this.newCommentText = ''; }
  }

  onEdit() { this.router.navigate(['/edit-post', this.post.id]); }

  onDelete() {
    if(confirm('Delete permanently?')) {
      this.postService.deletePost(this.post.id).subscribe(() => window.location.reload());
    }
  }

  serveProfile(id?: number) { this.router.navigate(['/profile', id]); }

  @HostListener('document:click')
  closeOptions() { this.showOptions = false; }
}