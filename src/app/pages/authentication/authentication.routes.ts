import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { RoleGuard } from 'src/app/services/roleguard/roleguard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
    ],
  },
];
