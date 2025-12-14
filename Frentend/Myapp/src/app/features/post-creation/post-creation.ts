import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Loading } from '../../shared/components/loading/loading';
import { PostService } from '../../core/services/post.service';

@Component({
  selector: 'app-post-creation',
  standalone: true,
  imports: [FormsModule, Loading],
  templateUrl: './post-creation.html',
  styleUrls: ['./post-creation.css']
})
export class PostCreationComponent {
  isLoading: boolean = false;
  title = '';
  description = '';
  content = '';
  media: File | null = null;
  errorMessage = '';

  constructor(private router: Router, private postService: PostService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.media = file;
    }
  }

  createPost() {
    if (!this.title || !this.description || !this.content) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('content', this.content);
    if (this.media) {
      formData.append('media', this.media, this.media.name);
    }

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Post created successfully:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Post creation failed:', error);
        this.errorMessage = error.error.message || 'Post creation failed. Please try again.';
      }
    });
  }
}
