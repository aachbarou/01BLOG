import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { HomeComponent } from './features/home/home';
import { RegisterComponent } from './features/auth/registre/registre';
import { ResetPass } from './features/auth/login/reset-pass/reset-pass';
import { ProfileComponent } from './shared/components/profile/profile';
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    {path : 'signup', component : RegisterComponent},
    {path : 'help', component : ResetPass},
    {path : 'profile' , component : ProfileComponent},
    {path : '**', redirectTo: ''}
];

