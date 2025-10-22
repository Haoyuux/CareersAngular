import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import {
  HrmsServices,
  InsertOrUpdateUserResumeDto,
  UserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { LoadingService } from 'src/app/services/auth-services/loading-services';

@Component({
  selector: 'app-resume-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-tab.component.html',
  styleUrl: './resume-tab.component.scss',
})
export class ResumeTabComponent implements OnInit {
  userData: UserDto = new UserDto();
  hasResumeValue: boolean = false;

  constructor(
    private _userService: UserServices,
    private _hrmsService: HrmsServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.onGetDetails();
  }

  onGetDetails(): void {
    this.loadingService.show();
    this._userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.userData = res.data;
        // ✅ Mark résumé as existing only if URL is present
        this.hasResumeValue = !!this.userData?.userResumeFile;
        this.loadingService.hide();
      },
      error: () => {
        this.loadingService.hide();
        this.ngxToastrMessage.showtoastr(
          'Failed to load user details',
          'Error'
        );
      },
    });
  }

  getResumeName(): string {
    if (this.hasResumeValue && this.userData.userResumeFile) {
      try {
        const url = new URL(this.userData.userResumeFile);
        return decodeURIComponent(
          url.pathname.split('/').pop() || 'Resume.pdf'
        );
      } catch {
        return 'Resume.pdf';
      }
    }
    return 'No résumé uploaded';
  }

  openResume(): void {
    if (this.userData?.userResumeFile) {
      window.open(this.userData.userResumeFile, '_blank');
    } else {
      this.ngxToastrMessage.showtoastr('No résumé available.', 'Notice');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;
        this.onUploadResume(base64, file.name, file.type);
      };

      reader.readAsDataURL(file);
    }
  }

  onUploadResume(
    base64Image?: string,
    fileName?: string,
    contentType?: string
  ): void {
    const payload = new InsertOrUpdateUserResumeDto({
      userResumeBase64: base64Image ?? '',
      userResumeFileName: fileName ?? '',
      userResumeContentType: contentType ?? '',
      removeUserResume: false,
    });

    this._userService.insertOrUpdateUserResume(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.onGetDetails();
          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        } else {
          this.ngxToastrMessage.showtoastr(res.errorMessage, 'Error');
        }
      },
      error: () => {
        this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
      },
    });
  }

  onRemoveResume(): void {
    const payload = new InsertOrUpdateUserResumeDto({
      userResumeBase64: '',
      userResumeFileName: '',
      userResumeContentType: '',
      removeUserResume: true,
    });

    this._userService.insertOrUpdateUserResume(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.onGetDetails();
          this.ngxToastrMessage.showtoastr(res.data, 'Removed Successfully');
        } else {
          this.ngxToastrMessage.showtoastr(res.errorMessage, 'Error');
        }
      },
      error: () => {
        this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
      },
    });
  }
}
