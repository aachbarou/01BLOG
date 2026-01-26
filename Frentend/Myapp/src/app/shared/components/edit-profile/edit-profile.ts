import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class ProfileSettingsComponent implements OnInit {
  formData = {
    name: '',
    username: '',
    bio: '',
    website: '',
    avatarUrl: ''
  };
  
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSaving = false;

  constructor(
    private userService: UserService, 
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.userService.getUserProfile().subscribe(res => {
      this.formData.name = res.data.name;
      this.formData.username = res.data.name.toLowerCase().replace(/\s/g, '_');
      this.formData.bio = res.data.bio || '';
      this.formData.avatarUrl = res.data.avatarUrl;
      this.imagePreview = res.data.avatarUrl; 
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  handleSave() {
    this.isSaving = true;
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const uploadData = new FormData();
    uploadData.append('username', this.formData.username);
    uploadData.append('bio', this.formData.bio);
    
    if (this.selectedFile) {
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
    }

    this.http.put('http://localhost:8080/api/users/update', uploadData, { headers }).subscribe({
      next: () => {
        this.isSaving = false;
        this.userService.loadCurrentUser(); 
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.isSaving = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}