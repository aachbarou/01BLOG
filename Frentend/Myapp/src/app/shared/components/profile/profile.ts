import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile?: any;
  isOwnProfile: boolean = true;
  isLoadingFollow: boolean = false;
  constructor(
    private userService: UserService,
    private cdn: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }
  fetchProfile(id?: number): void {
    this.userService.getUserProfile(id).subscribe({
      next: (response) => {
        this.profile = response.data;
        this.isOwnProfile = this.profile.owned;
        this.cdn.detectChanges();
      }
    });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.fetchProfile(+userId);
      } else {
        this.fetchProfile();
      }
    });
  }

  

  

  toggleFollow(): void {
    if (!this.profile || this.isOwnProfile || this.isLoadingFollow) return;

    this.isLoadingFollow = true;
    this.userService.toggleFollow(this.profile.id).subscribe({
      next: () => {
        this.profile.isFollowing = !this.profile.isFollowing;
        this.profile.stats.followers += this.profile.isFollowing ? 1 : -1;
        this.isLoadingFollow = false;
        this.cdn.detectChanges();
      },
      error: () => this.isLoadingFollow = false 
    });
  }
}