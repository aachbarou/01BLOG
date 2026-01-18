import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post';
import { UserProfile } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile?: UserProfile;
  isEditing: boolean = false;

  constructor(
    private userService: UserService, 
    private  cdn : ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.cdn.detectChanges();
        console.log('Profile fetched:', this.profile);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }

  
  
}