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

  userData: UserDto = new UserDto();
  hasResumeValue: boolean = false;

  onGetDetails() {
    this.loadingService.show();
    this._userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.userData = res.data;
        // Update hasResume value once
        this.hasResumeValue = !!(this.userData && this.userData.userResumeByte);
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      },
    });
  }

  getUserResume(): string {
    if (this.userData && this.userData.userResumeByte) {
      return `data:application/pdf;base64,${this.userData.userResumeByte}`;
    }
    return '';
  }

  getResumeName(): string {
    if (this.userData && this.userData.userResumeByte) {
      return this.userData.firstName
        ? `${this.userData.firstName}_Resume.pdf`
        : 'Resume.pdf';
    }
    return 'No resume uploaded';
  }

  hasResume(): boolean {
    return this.hasResumeValue;
  }

  base64ToBlobUrl(base64: string, mimeType: string): string {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  openResume(): void {
    const b64 = this.userData?.userResumeByte;
    if (!b64) return;

    const blobUrl = this.base64ToBlobUrl(b64, 'application/pdf');
    // Open in new tab/window; noopener for security
    const win = window.open(blobUrl, '_blank', 'noopener');
    // Revoke after a while to free memory
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);

    if (!win) {
      // Popup blocked—fallback: prompt user to allow popups
      this.ngxToastrMessage.showtoastr(
        'Please allow pop-ups to view the PDF.',
        'Notice'
      );
    }
  }

  onFileSelected(event: Event) {
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
  ) {
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

  onRemoveResume() {
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
