import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PostService} from '../../../core/services/post.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-edit-component.html',
  styleUrl: './post-edit-component.css'
})
export class PostEditComponent implements OnInit {
  postId!: number;
  postData = {
    title: '',
    content: '',
    mediaUrl: ''
  };
  isLoading = false;
  isPreview = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.postId = +this.route.snapshot.params['id'];
    this.loadPost();
  }

  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (res) => {
        this.postData.title = res.data.title;
        this.postData.content = res.data.content;
        this.postData.mediaUrl = res.data.mediaUrl || '';
        this.cdr.detectChanges();
      }
    });
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/files/${url}`;
  }

  isVideo(url: string): boolean {
    return url.toLowerCase().endsWith('.mp4');
  }

  updatePost() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('title', this.postData.title);
    formData.append('content', this.postData.content);
    
    this.postService.updatePost(this.postId, formData).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => this.isLoading = false
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}