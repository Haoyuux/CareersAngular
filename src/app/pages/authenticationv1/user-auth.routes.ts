import { Routes } from '@angular/router';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';

export const UserAuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user-login',
        component: UserLoginComponent,
      },
      {
        path: 'user-register',
        component: UserRegisterComponent,
      },
    ],
  },
];
