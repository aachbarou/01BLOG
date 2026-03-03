import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post';
import { EmptyStateComponent } from '../empty-state/empty-state';
import { ReportModalComponent } from '../report-modal/report-modal';
import { UserService } from '../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostComponent, EmptyStateComponent, ReportModalComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  profile?: any;
  isOwnProfile: boolean = false;
  isLoadingFollow: boolean = false;
  isLoading: boolean = true;
  errorCode: number | null = null;

  constructor(
    private userService: UserService,
    private cdn: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  fetchProfile(id?: number): void {
    this.isLoading = true;
    this.errorCode = null;
    this.userService.getUserProfile(id).subscribe({
      next: (response) => {
        this.profile = response.data;
        this.profile.avatarUrl = this.profile.avatarUrl;
        this.isOwnProfile = this.profile.owned;
        this.isLoading = false;
        this.cdn.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorCode = err.status || 500;
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
        this.fetchProfile(this.profile.id);
        this.cdn.detectChanges();
        this.isLoadingFollow = false;
      },
      error: () => this.isLoadingFollow = false
    });
  }

  editProfile(): void {
    this.router.navigate(['/profile/settings']);
  }

  goCreatePost(): void {
    this.router.navigate(['/create-post']);
  }

  showReportModal = false;

  openReportModal(): void {
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
  }

  onReportSubmitted(): void {
    alert('Thank you, the user has been reported.');
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}