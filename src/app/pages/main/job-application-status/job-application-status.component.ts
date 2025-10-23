import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
import {
  ApplicantJobLogsHeaderDto,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  status: 'Active' | 'In Progress' | 'Completed' | 'On Hold';
  applicants: number;
  stats: TimelineItem[];
}

interface TimelineItem {
  id: number;
  time: string;
  color: string;
  subtext?: string;
  title?: string;
  link?: boolean;
}

@Component({
  selector: 'app-job-application-status',
  standalone: true,
  imports: [MatPaginator, MaterialModule, CommonModule, FormsModule],
  templateUrl: './job-application-status.component.html',
  styleUrl: './job-application-status.component.scss',
})
export class JobApplicationStatusComponent implements OnInit {
  /**
   *
   */
  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.onGetUserApplicationLogs();
  }

  jobstatusData: ApplicantJobLogsHeaderDto[] = [];
  onGetUserApplicationLogs() {
    this.userService.getJobApplicationStatus().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.table(res);
          this.jobstatusData = res.data;
        }
      },
    });
  }

  jobs: JobPosting[] = [
    {
      id: 'JOB-2024-001',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120k - $160k',
      posted: '2 days ago',
      status: 'Active',
      applicants: 45,
      stats: [
        {
          id: 1,
          time: '09:30 AM',
          color: 'primary',
          subtext: 'Job posting published',
          title: 'Position opened for applications',
          link: true,
        },
        {
          id: 2,
          time: '11:45 AM',
          color: 'success',
          subtext: 'First batch of applications received',
          title: '15 candidates applied',
        },
        {
          id: 3,
          time: '02:15 PM',
          color: 'warning',
          title: 'Screening in progress',
        },
      ],
    },
    {
      id: 'JOB-2024-002',
      title: 'Backend Engineer (Node.js)',
      company: 'DataStream Inc',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130k - $170k',
      posted: '5 days ago',
      status: 'In Progress',
      applicants: 67,
      stats: [
        {
          id: 1,
          time: '08:00 AM',
          color: 'accent',
          subtext: 'Job requirements updated',
          title: 'Technical stack revised',
          link: true,
        },
        {
          id: 2,
          time: '10:30 AM',
          color: 'primary',
          title: 'Interview rounds scheduled',
        },
        {
          id: 3,
          time: '03:00 PM',
          color: 'success',
          subtext: 'Shortlist completed',
          title: '12 candidates selected for interview',
        },
      ],
    },
    {
      id: 'JOB-2024-003',
      title: 'UI/UX Designer',
      company: 'Creative Labs',
      location: 'Austin, TX',
      type: 'Contract',
      salary: '$90k - $120k',
      posted: '1 week ago',
      status: 'Active',
      applicants: 89,
      stats: [
        {
          id: 1,
          time: '09:00 AM',
          color: 'warning',
          subtext: 'Portfolio review initiated',
          title: 'Design challenge sent to candidates',
          link: true,
        },
        {
          id: 2,
          time: '12:00 PM',
          color: 'primary',
          title: 'Submissions under review',
        },
        {
          id: 3,
          time: '04:30 PM',
          color: 'error',
          subtext: 'Extended deadline',
          title: 'Additional time granted for submissions',
        },
      ],
    },
    {
      id: 'JOB-2024-004',
      title: 'DevOps Engineer',
      company: 'CloudScale Technologies',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$140k - $180k',
      posted: '3 days ago',
      status: 'Completed',
      applicants: 34,
      stats: [
        {
          id: 1,
          time: '07:30 AM',
          color: 'success',
          subtext: 'Position filled',
          title: 'Offer accepted by candidate',
          link: true,
        },
        {
          id: 2,
          time: '10:00 AM',
          color: 'accent',
          title: 'Onboarding process started',
        },
        {
          id: 3,
          time: '01:00 PM',
          color: 'success',
          subtext: 'Job posting closed',
          title: 'All applicants notified',
        },
      ],
    },
    {
      id: 'JOB-2024-005',
      title: 'Product Manager',
      company: 'InnovateTech',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$150k - $190k',
      posted: '4 days ago',
      status: 'On Hold',
      applicants: 52,
      stats: [
        {
          id: 1,
          time: '09:15 AM',
          color: 'primary',
          subtext: 'Application review completed',
          title: '25 qualified candidates identified',
          link: true,
        },
        {
          id: 2,
          time: '11:30 AM',
          color: 'warning',
          title: 'Process temporarily paused',
        },
        {
          id: 3,
          time: '03:45 PM',
          color: 'accent',
          subtext: 'Waiting for budget approval',
          title: 'Expected to resume next week',
        },
      ],
    },
    {
      id: 'JOB-2024-006',
      title: 'Software Developer',
      company: 'InnovateTech',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$150k - $190k',
      posted: '4 days ago',
      status: 'On Hold',
      applicants: 52,
      stats: [
        {
          id: 1,
          time: '09:15 AM',
          color: 'primary',
          subtext: 'Application review completed',
          title: '25 qualified candidates identified',
          link: true,
        },
        {
          id: 2,
          time: '11:30 AM',
          color: 'warning',
          title: 'Process temporarily paused',
        },
        {
          id: 3,
          time: '03:45 PM',
          color: 'accent',
          subtext: 'Waiting for budget approval',
          title: 'Expected to resume next week',
        },
      ],
    },
  ];

  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10];

  get paginatedJobs(): JobPosting[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.jobs.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  // getStatusClass(status: string): string {
  //   const statusMap: { [key: string]: string } = {
  //     Active: 'status-active',
  //     'In Progress': 'status-progress',
  //     Completed: 'status-completed',
  //     'On Hold': 'status-hold',
  //   };
  //   return statusMap[status] || '';
  // }

  getStatusClass(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'status-pending',
      1: 'status-active',
      2: 'status-in-progress',
      3: 'status-closed',
    };
    return statusMap[status] || 'status-default';
  }

  getStatusText(status: number): string {
    const statusMap: { [key: number]: string } = {
      0: 'Pending',
      1: 'Active',
      2: 'In Progress',
      3: 'Closed',
    };
    return statusMap[status] || 'Unknown';
  }

  getActivityColor(status: number, index: number): string {
    const colors = ['primary', 'accent', 'success', 'warning', 'info'];
    // You can map based on status or just cycle through colors
    return colors[index % colors.length];
  }

  typescriptformatTime(date: string | Date): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatTime(date: string | Date): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  formatFullDate(date: string | Date): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  formatDate(date: string | Date | null): string {
    if (!date) return 'N/A';

    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  getLatestActivityDate(job: any): string | Date | null {
    const logs = job.applicantJobLogsDtos;
    if (!logs || logs.length === 0) return null;
    return logs[logs.length - 1]?.creationTime;
  }
}
