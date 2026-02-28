import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../core/services/admin.service';
import { AdminUser, AdminPost, Report } from '../../core/models/admin.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
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
        this.loadTabData('overview');
    }

    loadTabData(tab: 'overview' | 'users' | 'posts' | 'reports'): void {
        this.activeTab = tab;
        this.isLoading = true;
        this.errorMessage = '';

        if (tab === 'overview') {
            this.loadAll();
        } else if (tab === 'users') {
            this.loadUsers(() => { this.isLoading = false; this.cdn.detectChanges(); });
        } else if (tab === 'posts') {
            this.loadPosts(() => { this.isLoading = false; this.cdn.detectChanges(); });
        } else if (tab === 'reports') {
            this.loadReports(() => { this.isLoading = false; this.cdn.detectChanges(); });
        }
    }

    loadAll(): void {
        let completed = 0;
        const checkDone = () => {
            completed++;
            if (completed >= 3) {
                this.isLoading = false;
                this.cdn.detectChanges();
            }
        };

        this.loadUsers(checkDone);
        this.loadPosts(checkDone);
        this.loadReports(checkDone);
    }

    loadUsers(callback?: () => void): void {
        this.adminService.getUsers().subscribe({
            next: (res) => { this.users = res.data || []; if (callback) callback(); },
            error: () => { if (callback) callback(); }
        });
    }

    loadPosts(callback?: () => void): void {
        this.adminService.getPosts().subscribe({
            next: (res) => { this.posts = res.data || []; if (callback) callback(); },
            error: () => { if (callback) callback(); }
        });
    }

    loadReports(callback?: () => void): void {
        this.adminService.getReports().subscribe({
            next: (res) => { this.reports = res.data || []; if (callback) callback(); },
            error: () => { if (callback) callback(); }
        });
    }

    setTab(tab: 'overview' | 'users' | 'posts' | 'reports'): void {
        this.loadTabData(tab);
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

    togglePostStatus(id: number, currentStatus: string | undefined): void {
        const newStatus = currentStatus === 'hidden' ? 'visible' : 'hidden';
        this.adminService.changePostStatus(id, newStatus).subscribe({
            next: () => {
                this.posts = this.posts.map(p =>
                    p.id === id ? { ...p, status: newStatus } : p
                );
                this.cdn.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to update post status';
                this.cdn.detectChanges();
                setTimeout(() => { this.errorMessage = ''; this.cdn.detectChanges(); }, 4000);
            }
        });
    }

    hidePostFromReport(targetId: number): void {
        this.adminService.changePostStatus(targetId, 'hidden').subscribe({
            next: () => {
                this.posts = this.posts.map(p =>
                    p.id === targetId ? { ...p, status: 'hidden' } : p
                );
                this.cdn.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Failed to hide post';
                this.cdn.detectChanges();
                setTimeout(() => { this.errorMessage = ''; this.cdn.detectChanges(); }, 4000);
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
