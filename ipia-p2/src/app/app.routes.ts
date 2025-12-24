import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ViewMyProfile } from './view-my-profile/view-my-profile';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'register', component: Register },
    { path: 'view-my-profile', component: ViewMyProfile }
];
