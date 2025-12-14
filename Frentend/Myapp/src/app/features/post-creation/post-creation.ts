import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

declare var lucide: any; 

@Component({
  selector: 'app-post-creation',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './post-creation.html',
  styleUrls: ['./post-creation.css'],
})
export class PostCreationComponent implements OnInit, AfterViewChecked {
  title: string = '';
  description: string = '';
  content: string = '';
  mediaFile: File | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  @ViewChild('postForm') postForm!: NgForm;

  constructor(
    private postService: PostService,
    private router: Router,
    private el: ElementRef 
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewChecked(): void {
    lucide.createIcons();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.mediaFile = input.files[0];
      this.updateMediaDisplay();
    }
  }

  clearFile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.mediaFile = null;
    const fileInput = this.el.nativeElement.querySelector('#media') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; 
    }
    this.updateMediaDisplay();
  }

  updateMediaDisplay(): void {
    const dropZone = this.el.nativeElement.querySelector('#drop-zone');
    const uploadPrompt = this.el.nativeElement.querySelector('#upload-prompt');
    const filePreview = this.el.nativeElement.querySelector('#file-preview');
    const fileNameElement = this.el.nativeElement.querySelector('#file-name');

    if (this.mediaFile) {
      if (uploadPrompt) uploadPrompt.classList.add('hidden');
      if (filePreview) filePreview.classList.remove('hidden');
      if (fileNameElement) fileNameElement.textContent = this.mediaFile.name;
      if (dropZone) {
        dropZone.classList.add('border-brand-500', 'bg-brand-50/10');
        dropZone.classList.remove('border-stone-200');
      }
    } else {
      if (uploadPrompt) uploadPrompt.classList.remove('hidden');
      if (filePreview) filePreview.classList.add('hidden');
      if (dropZone) {
        dropZone.classList.remove('border-brand-500', 'bg-brand-50/10');
        dropZone.classList.add('border-stone-200');
      }
    }
  }

  createPost(): void {
    if (this.postForm.form.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('content', this.content);
    if (this.mediaFile) {
      formData.append('media', this.mediaFile, this.mediaFile.name);
    }

    this.postService.createPost(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to create post. Please try again.';
        console.error('Error creating post:', error);
      }
    });
  }
}