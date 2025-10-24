import { Routes } from '@angular/router';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { JobApplicationStatusComponent } from './job-application-status/job-application-status.component';
import { JobOfferComponent } from './job-offer/job-offer.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { MainDashboardJobdetailsViewComponent } from './main-dashboard-jobdetails-view/main-dashboard-jobdetails-view.component';

export const mainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'main-dashboard',
        component: MainDashboardComponent,
      },
      {
        path: 'main-dashboard-jobdetails-view/:id',
        component: MainDashboardJobdetailsViewComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'job-application',
        component: JobApplicationStatusComponent,
      },
      {
        path: 'job-offer',
        component: JobOfferComponent,
      },
      {
        path: 'appointment-calendar',
        component: AppointmentCalendarComponent,
      },
      {
        path: 'requirements',
        component: RequirementsComponent,
      },
    ],
  },
];
