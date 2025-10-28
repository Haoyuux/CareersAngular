import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { RoleGuard } from 'src/app/services/roleguard/roleguard';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'chips',
        component: AppChipsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'lists',
        component: AppListsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'menu',
        component: AppMenuComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'forms',
        component: AppFormsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
      {
        path: 'tables',
        component: AppTablesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Admin'] },
      },
    ],
  },
];
