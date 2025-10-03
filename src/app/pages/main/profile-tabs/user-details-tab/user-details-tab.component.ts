import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EducationTabComponent } from '../education-tab/education-tab.component';
import { WorkExperienceTabComponent } from '../work-experience-tab/work-experience-tab.component';
import { CertificateTabComponent } from '../certificate-tab/certificate-tab.component';
import {
  GetAllCivilStatusDto,
  GetAllGenderDto,
  HrmsServices,
  InsertOrUpdateUserCoverPhotoDto,
  InsertOrUpdateUserProfileDto,
  UserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditProfileComponent } from '../../edit-profile/edit-profile.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { PlaceSearchComponentV1Component } from '../../component/place-search-component-v1/place-search-component-v1.component';

@Component({
  selector: 'app-user-details-tab',
  standalone: true,
  imports: [
    EducationTabComponent,
    WorkExperienceTabComponent,
    CertificateTabComponent,
    CommonModule,
    FormsModule,
    PlaceSearchComponentV1Component,
  ],
  templateUrl: './user-details-tab.component.html',
  styleUrl: './user-details-tab.component.scss',
})
export class UserDetailsTabComponent implements OnInit {
  @Output() profileUpdated = new EventEmitter<void>();
  @Output() closeDialog = new EventEmitter<boolean>();
  @Input() skipUserAddress = true;

  @ViewChild('placeSearch', { static: false })
  placeSearch?: PlaceSearchComponentV1Component;

  constructor(
    private _userService: UserServices,
    private _hrmsService: HrmsServices,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}

  ngOnInit(): void {
    this.onGetDetails();
    this.onGetAllGender();
    this.onGetAllCivilStatus();
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
      return `data:image/jpeg;base64,${this.userData.userProfileByte}`;
    }

    return 'assets/images/profile/user-5.jpg';
  }

  getUserCoverImage(): string {
    if (this.userData && this.userData.userCoverPhotoByte) {
      return `data:image/jpeg;base64,${this.userData.userCoverPhotoByte}`;
    }

    return 'assets/images/profile/careers-cover.jpg';
  }

  dataGender: GetAllGenderDto[] = [];
  onGetAllGender() {
    this._hrmsService.getAllGender().subscribe({
      next: (res) => {
        this.dataGender = res.data;
      },
    });
  }

  dataCivilStatus: GetAllCivilStatusDto[] = [];
  onGetAllCivilStatus() {
    this._hrmsService.getAllCivilStatus().subscribe({
      next: (res) => {
        this.dataCivilStatus = res.data;
      },
    });
  }

  onUpdateUserDetails() {
    const address = (this.userData.address ?? '').trim();

    this.userData.address = address;

    if (!address) {
      this.ngxToastrMessage.showtoastrInfo(
        'Please select or type a location.',
        'Validation'
      );
      return;
    }
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

  onDobChange(event: any) {
    this.userData.dateOfBirth = event ? new Date(event) : undefined;
  }

  onFileSelected(event: Event, clickedButton: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        if (clickedButton == 1) {
          //uploadpicture
          this.onUploadUserProfile(base64, file.name, file.type);
        } else {
          //cover
          this.onUploadCoverPhoto(base64, file.name, file.type);
        }
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

  onUploadCoverPhoto(
    base64Image?: string,
    fileName?: string,
    contentType?: string
  ) {
    const payload = new InsertOrUpdateUserCoverPhotoDto({
      coverImageBase64: base64Image ?? '',
      coverImageFileName: fileName ?? '',
      coverImageContentType: contentType ?? '',
      removeCoverImage: false,
    });

    this._userService.insertOrUpdateUserCoverPhoto(payload).subscribe({
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

  onRemoveCoverPhoto() {
    const payload = new InsertOrUpdateUserCoverPhotoDto({
      coverImageBase64: '',
      coverImageFileName: '',
      coverImageContentType: '',
      removeCoverImage: true,
    });

    this._userService.insertOrUpdateUserCoverPhoto(payload).subscribe({
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
