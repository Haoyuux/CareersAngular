import { Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const mainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main-dashboard',
        component: MainDashboardComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
    ],
  },
];
