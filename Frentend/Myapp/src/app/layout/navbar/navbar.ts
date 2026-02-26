import { Component, Injectable, HostListener, AfterViewChecked, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AutGuard } from '../../core/guards/auth.guard';
import { AuthServices } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { setDefaultHighWaterMark } from 'node:stream';
import { UserService } from '../../core/services/user.service';
import { NotificationService } from '../../core/services/notification.service';

declare var lucide: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
@Injectable({
  providedIn: 'root'
})
export class Navbar implements OnInit, AfterViewChecked {
  constructor(private router: Router, private Auth: AutGuard, private Auths: AuthServices, private User: UserService, private notificationService: NotificationService) { }

  formData = {
    name: '',
    username: '',
    email: '',
    role: '',
    avatarUrl: ''
  };

  isDropdownOpen: boolean = false;
  isNotifOpen: boolean = false;

  notifications: any[] = [];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.notifications = res.data;
          console.log(this.notifications);
        }
      },
      error: (err) => console.error('Failed to load notifications', err)
    });
  }



  ngOnInit() {
    this.User.loadCurrentUser();
    this.User.currentUser$.subscribe((user) => {
      if (user) {
        this.formData.name = user.name;
        this.formData.username = user.name;
        this.formData.email = user.email;
        this.formData.role = user.stats.role;
        this.formData.avatarUrl = user.avatarUrl;
        this.loadNotifications();
      }
    });
  }

  ngAfterViewChecked() {
    lucide.createIcons();
  }

  profileToggle(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isNotifOpen = false;
  }

  notifToggle(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isNotifOpen = !this.isNotifOpen;
    this.isDropdownOpen = false;
  }

  onMarkRead(id: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
      }
    });
  }

  onMarkAllRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
      }
    });
  }

  navigateToProfile() {
    this.isDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  rerender() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.isDropdownOpen = false;
    this.Auths.logoutSet();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (!target.closest('.profile-dropdown-container') && !target.closest('.notif-dropdown-container')) {
      this.isDropdownOpen = false;
      this.isNotifOpen = false;
    }
  }
  navigateToPostCreation() {
    this.router.navigate(['/create-post']);
  }
  navigateToSaved() {
    this.isDropdownOpen = false;
    this.router.navigate(['/saved']);
  }
  navigateToSettings() {
    this.isDropdownOpen = false;
    this.router.navigate(['profile/settings']);
  }
  navigateToAdmin() {
    this.router.navigate(['/admin']);
  }
}