import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ViewMyProfile } from './view-my-profile/view-my-profile';
import { Studentfz } from './studentfz/studentfz';
import { MojiTrackeri } from './moji-trackeri/moji-trackeri';
import { VisionBoardComponent } from './visionboard/visionboard';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'register', component: Register },
    { path: 'view-my-profile', component: ViewMyProfile },
    { path: 'studentfunzone', component: Studentfz },
    { path: 'mytrackers', component: MojiTrackeri },
    { path: 'visionboard', component: VisionBoardComponent },
];
