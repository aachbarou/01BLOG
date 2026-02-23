import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, take, filter, timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const AdminGuard: CanActivateFn = () => {
    const platformId = inject(PLATFORM_ID);
    const userService = inject(UserService);
    const router = inject(Router);

    // Skip guard on server (SSR) — no localStorage available
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // Make sure user profile is being loaded
    userService.loadCurrentUser();

    return userService.currentUser$.pipe(
        filter(user => user !== null),
        take(1),
        timeout(5000),
        map(user => {
            if (user?.stats?.role?.toLowerCase() === 'admin') {
                return true;
            }
            router.navigate(['/home']);
            return false;
        }),
        catchError(() => {
            router.navigate(['/home']);
            return of(false);
        })
    );
};
