import { Routes } from '@angular/router';

// pages
import { AppIconsComponent } from './icons/icons.component';
import { AppSamplePageComponent } from './sample-page/sample-page.component';
import { RoleGuard } from 'src/app/services/roleguard/roleguard';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'icons',
        component: AppIconsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'sample-page',
        component: AppSamplePageComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
    ],
  },
];
