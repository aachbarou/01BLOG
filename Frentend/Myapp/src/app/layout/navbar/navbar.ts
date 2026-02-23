import { Component, Injectable, HostListener, AfterViewChecked, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AutGuard } from '../../core/guards/auth.guard';
import { AuthServices } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { setDefaultHighWaterMark } from 'node:stream';
import { UserService } from '../../core/services/user.service';

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
  constructor(private router: Router, private Auth: AutGuard, private Auths: AuthServices, private User: UserService) { }

  formData = {
    name: '',
    username: '',
    email: '',
    role: '',
    avatarUrl: ''
  };

  isDropdownOpen: boolean = false;


  ngOnInit() {
    this.User.loadCurrentUser();
    this.User.currentUser$.subscribe((user) => {
      if (user) {
        this.formData.name = user.name;
        this.formData.username = user.name;
        this.formData.email = user.email;
        this.formData.role = user.stats.role;
        this.formData.avatarUrl = user.avatarUrl;
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

    if (!target.closest('.profile-dropdown-container')) {
      this.isDropdownOpen = false;
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