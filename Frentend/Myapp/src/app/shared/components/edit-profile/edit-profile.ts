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
      this.cdr.detectChanges();
    });
  }

  handleSave() {
    this.isSaving = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const updateData = {
      username: this.formData.username,
      status: this.formData.bio 
    };

    this.http.put('http://localhost:8080/api/users/update', updateData, { headers }).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/profile']);
      },
      error: () => this.isSaving = false
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}