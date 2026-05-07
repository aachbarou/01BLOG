import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-post-creation',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './post-creation.html',
  styleUrls: ['./post-creation.css'],
})
export class PostCreationComponent implements OnInit {
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
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.mediaFile = input.files[0];
      this.updateMediaDisplay();
    }
  }

  clearFile(event: Event): void {
    event.preventDefault();
    this.mediaFile = null;

    if (isPlatformBrowser(this.platformId)) {
      const fileInput = this.el.nativeElement.querySelector('#media') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
    this.updateMediaDisplay();
  }

  updateMediaDisplay(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const dropZone = this.el.nativeElement.querySelector('#drop-zone');
    const uploadPrompt = this.el.nativeElement.querySelector('#upload-prompt');
    const filePreview = this.el.nativeElement.querySelector('#file-preview');
    const fileNameElement = this.el.nativeElement.querySelector('#file-name');
    
    const imgRender = this.el.nativeElement.querySelector('#image-render');
    const videoRender = this.el.nativeElement.querySelector('#video-render');

    if (this.mediaFile) {
      if (uploadPrompt) uploadPrompt.classList.add('hidden');
      if (filePreview) filePreview.classList.remove('hidden');
      if (fileNameElement) fileNameElement.textContent = this.mediaFile.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const result = e.target.result;
        
        if (this.mediaFile?.type.startsWith('image/')) {
          if (imgRender) {
            imgRender.src = result;
            imgRender.classList.remove('hidden');
          }
          if (videoRender) videoRender.classList.add('hidden');
        } else if (this.mediaFile?.type.startsWith('video/')) {
          if (videoRender) {
            videoRender.src = result;
            videoRender.classList.remove('hidden');
          }
          if (imgRender) imgRender.classList.add('hidden');
        }
      };
      reader.readAsDataURL(this.mediaFile);

      if (dropZone) {
        dropZone.classList.add('border-brand-500', 'bg-brand-50/10');
        dropZone.classList.remove('border-stone-200');
      }
    } else {
      if (uploadPrompt) uploadPrompt.classList.remove('hidden');
      if (filePreview) filePreview.classList.add('hidden');
      if (imgRender) imgRender.classList.add('hidden');
      if (videoRender) videoRender.classList.add('hidden');
      
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
    formData.append('content', this.content);
    if (this.mediaFile) {
      formData.append('file', this.mediaFile, this.mediaFile.name);
    }

    this.postService.createPost(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'An error occurred while creating the post.';
        this.cdr.detectChanges();
      }
    });
  }
}