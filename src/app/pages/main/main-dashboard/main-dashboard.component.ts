import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import {
  ApplicantdataDto,
  GetAllJobPostsDto,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { FormsModule } from '@angular/forms';
import { authService } from 'src/app/services/auth-services/auth-services';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent implements OnInit, AfterViewInit {
  jobPostData: GetAllJobPostsDto[] = [];
  selectedJobId: string | null = null;
  dataApplyJob: ApplicantdataDto = new ApplicantdataDto();

  constructor(
    private _hrmsService: HrmsServices,
    public authservice: authService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private _userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Implementation if needed
  }

  ngOnInit(): void {
    this.onGetJobPosting();
  }

  onGetJobPosting() {
    this.loadingService.show();

    this._hrmsService.getAllJobPosts().subscribe({
      next: (res) => {
        this.jobPostData = res.data;
        this.loadingService.hide();

        // Auto-select first job on desktop
        if (
          this.jobPostData &&
          this.jobPostData.length > 0 &&
          window.innerWidth > 768
        ) {
          this.selectedJobId = this.jobPostData[0].jobPostingId || null;
        }
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error loading job posts:', err);
      },
    });
  }

  selectJob(jobId: string): void {
    console.log('=== SELECT JOB DEBUG ===');
    console.log('Job ID clicked:', jobId);
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile?', window.innerWidth <= 768);

    // Check if we're on mobile (768px or below)
    if (window.innerWidth <= 768) {
      console.log('Mobile view - attempting navigation...');

      // Find the job data
      const jobData = this.jobPostData.find(
        (job) => job.jobPostingId === jobId
      );
      console.log('Found job data:', jobData);

      if (!jobData) {
        console.error('Job data not found for ID:', jobId);
        return;
      }

      // Navigate to job details page with the data
      // Updated path to include /main parent route
      console.log(
        'Navigating to: /main/main-dashboard-jobdetails-view/' + jobId
      );

      this.router
        .navigate(['/main/main-dashboard-jobdetails-view', jobId], {
          state: { jobData: jobData },
        })
        .then(
          (success) => {
            console.log('Navigation successful:', success);
          },
          (error) => {
            console.error('Navigation failed:', error);
          }
        );
    } else {
      console.log('Desktop view - selecting job in panel');
      // Desktop behavior - just select the job and show in right panel
      this.selectedJobId = jobId;
    }
  }

  onApplyJob(jobPostingId: string, jobTitleId: string) {
    this.dataApplyJob.jobPostingId = jobPostingId;
    this.dataApplyJob.jobTitleId = jobTitleId;

    this._userService.insertToApplicantMasterList(this.dataApplyJob).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.ngxToastrMessage.showtoastr('Applied Successfully', res.data);
        } else {
          this.ngxToastrMessage.showtoastrInfo('Notice', res.errorMessage);
        }
      },
      error: (err) => {
        console.error('Error applying for job:', err);
        this.ngxToastrMessage.showtoastrInfo(
          'Error',
          'Failed to apply for job'
        );
      },
    });
  }

  get selectedJob(): GetAllJobPostsDto | undefined {
    if (!this.jobPostData || this.jobPostData.length === 0) {
      return undefined;
    }

    return (
      this.jobPostData.find((job) => job.jobPostingId === this.selectedJobId) ||
      this.jobPostData[0]
    );
  }

  getLogoColor(theme: string): string {
    switch (theme) {
      case 'tech':
        return '#3B82F6';
      case 'marketing':
        return '#EF4444';
      case 'healthcare':
        return '#059669';
      default:
        return '#3B82F6';
    }
  }
}
