import { Component } from '@angular/core';
import { EducationTabComponent } from '../education-tab/education-tab.component';
import { WorkExperienceTabComponent } from '../work-experience-tab/work-experience-tab.component';
import { CertificateTabComponent } from '../certificate-tab/certificate-tab.component';

@Component({
  selector: 'app-user-details-tab',
  standalone: true,
  imports: [
    EducationTabComponent,
    WorkExperienceTabComponent,
    CertificateTabComponent,
  ],
  templateUrl: './user-details-tab.component.html',
  styleUrl: './user-details-tab.component.scss',
})
export class UserDetailsTabComponent {}
