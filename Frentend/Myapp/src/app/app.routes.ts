import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { HomeComponent } from './features/home/home';
import { RegisterComponent } from './features/auth/registre/registre';
import { ResetPass } from './features/auth/login/reset-pass/reset-pass';
import { ProfileComponent } from './shared/components/profile/profile';
import { AutGuard } from './core/guards/auth.guard'
import { AuthGuest } from './core/guards/auth.guest'
import { PostCreationComponent } from './features/post-creation/post-creation';
import { ProfileSettingsComponent } from './shared/components/edit-profile/edit-profile';
import { ErrorPageComponent } from './shared/components/error-page-component/error-page-component';
import { PostEditComponent } from './shared/components/post-edit-component/post-edit-component';
import { AdminDashboardComponent } from './features/admin-dashboard/admin-dashboard';
import { AdminGuard } from './core/guards/admin.guard';
import { PostViewComponent } from './features/post-view/post-view';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AutGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuest] },
    { path: 'home', component: HomeComponent, canActivate: [AutGuard] },
    { path: 'signup', component: RegisterComponent, canActivate: [AuthGuest] },
    { path: 'help', component: ResetPass, canActivate: [AuthGuest] },
    { path: 'profile/settings', component: ProfileSettingsComponent, canActivate: [AutGuard] },

    { path: 'profile/:id', component: ProfileComponent, canActivate: [AutGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AutGuard] },
    { path: 'create-post', component: PostCreationComponent, canActivate: [AutGuard] },
    { path: 'edit-post/:id', component: PostEditComponent, canActivate: [AutGuard] },
    { path: 'post/:id', component: PostViewComponent, canActivate: [AutGuard] },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AutGuard, AdminGuard] },

    {
        path: 'error',
        component: ErrorPageComponent,
        data: { type: 'generic' }
    },
    {
        path: '**',
        component: ErrorPageComponent,
        data: { type: '404' }
    },
];
