import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AdminUser, AdminPost, Report } from '../../core/models/admin.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
    activeTab: 'overview' | 'users' | 'posts' | 'reports' = 'overview';
    tabs = ['overview', 'users', 'posts', 'reports'] as const;

    users: AdminUser[] = [];
    posts: AdminPost[] = [];
    reports: Report[] = [];

    isLoading = true;
    errorMessage = '';

    constructor(
        private adminService: AdminService,
        private cdn: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.isLoading = true;
        let completed = 0;
        const done = () => { completed++; if (completed >= 3) { this.isLoading = false; this.cdn.detectChanges(); } };

        this.adminService.getUsers().subscribe({
            next: (res) => { this.users = res.data || []; done(); },
            error: () => { done(); }
        });

        this.adminService.getPosts().subscribe({
            next: (res) => { this.posts = res.data || []; done(); },
            error: () => { done(); }
        });

        this.adminService.getReports().subscribe({
            next: (res) => { this.reports = res.data || []; done(); },
            error: () => { done(); }
        });
    }

    setTab(tab: 'overview' | 'users' | 'posts' | 'reports'): void {
        this.activeTab = tab;
    }

    // ── User Actions ──
    toggleBan(id: number): void {
        this.errorMessage = '';
        this.adminService.banUser(id).subscribe({
            next: (res) => {
                const isBanned = res.data === 'Banned';
                this.users = this.users.map(u =>
                    u.user_id === id ? { ...u, banned: isBanned } : u
                );
                this.cdn.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to update user status';
                this.cdn.detectChanges();
                setTimeout(() => { this.errorMessage = ''; this.cdn.detectChanges(); }, 4000);
            }
        });
    }

    deleteUser(id: number): void {
        this.errorMessage = '';
        this.adminService.deleteUser(id).subscribe({
            next: () => {
                this.users = this.users.filter(u => u.user_id !== id);
                this.cdn.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to delete user';
                this.cdn.detectChanges();
                setTimeout(() => { this.errorMessage = ''; this.cdn.detectChanges(); }, 4000);
            }
        });
    }

    // ── Post Actions ──
    deletePost(id: number): void {
        this.adminService.deletePost(id).subscribe({
            next: () => {
                this.posts = this.posts.filter(p => p.id !== id);
                this.cdn.detectChanges();
            }
        });
    }

    // ── Report Actions ──
    resolveReport(id: number): void {
        this.adminService.resolveReport(id).subscribe({
            next: () => {
                this.reports = this.reports.filter(r => r.id !== id);
                this.cdn.detectChanges();
            }
        });
    }

    isVideo(url?: string): boolean {
        return !!url && url.toLowerCase().endsWith('.mp4');
    }

    getAvatarUrl(user: AdminUser): string {
        if (user.userAvatar !== undefined && user.userAvatar !== null) {
            return "http://localhost:8080/files/" + user.userAvatar;
        }
        return `https://ui-avatars.com/api/?name=${user.username}&background=e7e5e4&color=1c1917`;
    }

    goBack(): void {
        this.router.navigate(['/home']);
    }
}
