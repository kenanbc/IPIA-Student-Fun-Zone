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
import { SleepTracker } from './sleep-tracker/sleep-tracker';
import { FocusTracker } from './focus-tracker/focus-tracker';
import { BudgetTracker } from './budget-tracker/budget-tracker';
import { ReadingTracker } from './reading-tracker/reading-tracker';
import { Bingo } from './bingo/bingo';
import { Whiteboard } from './whiteboard/whiteboard';

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
    path: 'bingo',
    component: Bingo,
    canActivate: [authGuard]
  },
  {
    path: 'water-tracker',
    component: WaterTracker,
    canActivate: [authGuard]
  },
  {
    path: 'sleep-tracker',
    component: SleepTracker,
    canActivate: [authGuard]
  },
  {
    path: 'focus-tracker',
    component: FocusTracker,
    canActivate: [authGuard]
  },
  {
    path: 'budget-tracker',
    component: BudgetTracker,
    canActivate: [authGuard]
  },
  {
    path: 'reading-tracker',
    component: ReadingTracker,
    canActivate: [authGuard]
  },
  {
    path: 'whiteboard',
    component: Whiteboard,
    canActivate: [authGuard]
  }
];
