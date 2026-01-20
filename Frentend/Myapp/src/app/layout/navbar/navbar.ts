import { Component, Injectable, HostListener, AfterViewChecked } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AutGuard } from '../../core/guards/auth.guard';
import { AuthServices } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { setDefaultHighWaterMark } from 'node:stream';

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
export class Navbar implements AfterViewChecked {
  constructor(private router: Router, private Auth: AutGuard, private Auths: AuthServices) { }
  
  username: string = 'Simo 6';
  isDropdownOpen: boolean = false;
  
  protected imageUrl: string = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQixhzI7xr1ouPUT_f7BIIS8ErIWs3Vx8FiZA&s';

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
}