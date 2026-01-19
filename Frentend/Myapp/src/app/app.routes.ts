import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { HomeComponent } from './features/home/home';
import { RegisterComponent } from './features/auth/registre/registre';
import { ResetPass } from './features/auth/login/reset-pass/reset-pass';
import { ProfileComponent } from './shared/components/profile/profile';
import { AutGuard } from './core/guards/auth.guard'
import { AuthGuest } from './core/guards/auth.guest'
import { PostCreationComponent } from './features/post-creation/post-creation';


export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AutGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuest] },
    { path: 'home', component: HomeComponent, canActivate: [AutGuard] },
    { path: 'signup', component: RegisterComponent, canActivate: [AuthGuest] },
    { path: 'help', component: ResetPass, canActivate: [AuthGuest] },
    { path: 'profile/:id', component: ProfileComponent, canActivate: [AutGuard] }, 
    { path: 'create-post', component: PostCreationComponent, canActivate: [AutGuard] },
    { path: '**', redirectTo: '' }
];
