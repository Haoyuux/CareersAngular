import { Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { JobApplicationStatusComponent } from './job-application-status/job-application-status.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { MainDashboardJobdetailsViewComponent } from './main-dashboard-jobdetails-view/main-dashboard-jobdetails-view.component';
import { RoleGuard } from 'src/app/services/roleguard/roleguard';

export const mainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main-dashboard',
        component: MainDashboardComponent,
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'main-dashboard-jobdetails-view/:id',
        component: MainDashboardJobdetailsViewComponent,
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        canActivate: [RoleGuard],
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'job-application',
        component: JobApplicationStatusComponent,
        canActivate: [RoleGuard],
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'job-offer',
        component: JobOfferComponent,
        canActivate: [RoleGuard],
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'appointment-calendar',
        component: AppointmentCalendarComponent,
        canActivate: [RoleGuard],
        data: { roles: ['User', 'Admin'] },
      },
      {
        path: 'requirements',
        component: RequirementsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['User', 'Admin'] },
      },
    ],
  },
];
