import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EducationTabComponent } from '../education-tab/education-tab.component';
import { WorkExperienceTabComponent } from '../work-experience-tab/work-experience-tab.component';
import { CertificateTabComponent } from '../certificate-tab/certificate-tab.component';
import {
  HrmsServices,
  InsertOrUpdateUserProfileDto,
  UserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditProfileComponent } from '../../edit-profile/edit-profile.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';

@Component({
  selector: 'app-user-details-tab',
  standalone: true,
  imports: [
    EducationTabComponent,
    WorkExperienceTabComponent,
    CertificateTabComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-details-tab.component.html',
  styleUrl: './user-details-tab.component.scss',
})
export class UserDetailsTabComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<boolean>();

  constructor(
    private _userService: UserServices,
    private _hrmsService: HrmsServices,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}
  ngOnInit(): void {
    this.onGetDetails();
  }

  userData: UserDto = new UserDto();
  onGetDetails() {
    this._userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.userData = res.data;
      },
    });
  }

  getUserProfileImage(): string {
    if (this.userData && this.userData.userProfileByte) {
      // Convert backend byte[] (base64 string) into data URL
      return `data:image/jpeg;base64,${this.userData.userProfileByte}`;
    }
    // fallback image if no profile picture
    return 'assets/images/profile/user-5.jpg';
  }

  onUpdateUserDetails() {
    this._userService.registerUser(this.userData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.closeDialog.emit(); // Tell parent to close dialog
          this.profileUpdated.emit(); // Tell parent to refresh profile

          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        }
      },
      error: (err) => {
        this.ngxToastrMessage.showtoastrInfo(err.message, 'Error');
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.onUploadUserProfile(base64, file.name, file.type);
      };
      reader.readAsDataURL(file);
    }
  }

  onUploadUserProfile(
    base64Image?: string,
    fileName?: string,
    contentType?: string
  ) {
    const payload = new InsertOrUpdateUserProfileDto({
      profileImageBase64: base64Image ?? '',
      profileImageFileName: fileName ?? '',
      profileImageContentType: contentType ?? '',
      removeProfileImage: false,
    });

    this._userService.insertOrUpdateUserProfile(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.onGetDetails();
          this.profileUpdated.emit();
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

  onRemoveUserProfile() {
    const payload = new InsertOrUpdateUserProfileDto({
      profileImageBase64: '',
      profileImageFileName: '',
      profileImageContentType: '',
      removeProfileImage: true,
    });

    this._userService.insertOrUpdateUserProfile(payload).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.onGetDetails();
          this.profileUpdated.emit();
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
