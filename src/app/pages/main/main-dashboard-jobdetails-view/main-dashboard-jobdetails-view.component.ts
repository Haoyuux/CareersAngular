import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-dashboard-jobdetails-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard-jobdetails-view.component.html',
  styleUrl: './main-dashboard-jobdetails-view.component.scss',
})
export class MainDashboardJobdetailsViewComponent implements OnInit {
  selectedJob: any = null;
  jobId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Get the job ID from the route parameters
    this.route.params.subscribe((params) => {
      this.jobId = params['id'];
      this.loadJobDetails(this.jobId);
    });
  }

  loadJobDetails(jobId: string): void {
    // Option 1: Get data from navigation state (passed from previous page)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['jobData']) {
      this.selectedJob = navigation.extras.state['jobData'];
      return;
    }

    // Option 2: Get data from history state (if user refreshes page)
    const state = this.location.getState() as any;
    if (state?.jobData) {
      this.selectedJob = state.jobData;
      return;
    }

    // Option 3: Fetch from service/API if no state data
    // If you have a job service, uncomment and use:
    // this.jobService.getJobById(jobId).subscribe(job => {
    //   this.selectedJob = job;
    // });

    // Temporary: If no data available, redirect back
    if (!this.selectedJob) {
      console.warn('No job data available, redirecting back...');
      this.goBack();
    }
  }

  goBack(): void {
    // Navigate back to previous page
    this.location.back();
  }

  onApplyJob(jobPostingId: string, jobTitleId: string): void {
    // Add your apply job logic here
    console.log('Applying for job:', jobPostingId, jobTitleId);

    // Example: Navigate to application form
    // this.router.navigate(['/apply', jobPostingId], {
    //   queryParams: { titleId: jobTitleId }
    // });

    // Or open a dialog/modal for the application form
    // this.dialog.open(ApplicationFormComponent, { data: { jobPostingId, jobTitleId } });
  }
}
