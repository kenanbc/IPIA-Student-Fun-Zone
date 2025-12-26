import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { ViewMyProfile } from './view-my-profile/view-my-profile';
import { Studentfz } from './studentfz/studentfz';
import { MojiTrackeri } from './moji-trackeri/moji-trackeri';
import { VisionBoardComponent } from './visionboard/visionboard';
import { authGuard } from './auth.guard';
import { noAuthGuard } from './no-auth.guard';
import { Home } from './home/home';
import { WaterTracker } from './water-tracker/water-tracker';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login,
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    component: Register,
    canActivate: [noAuthGuard]
  },
  {
    path: 'view-my-profile',
    component: ViewMyProfile,
    canActivate: [authGuard]
  },
  {
    path: 'studentfunzone',
    component: Studentfz,
    canActivate: [authGuard]
  },
  {
    path: 'mytrackers',
    component: MojiTrackeri,
    canActivate: [authGuard]
  },
  {
    path: 'visionboard',
    component: VisionBoardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'water-tracker',
    component: WaterTracker,
    canActivate: [authGuard]
  }
];
