import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  CreateOrEditEducationDto,
  CreateOrEditSkillsDto,
  CreateOrEditWorkExperienceDto,
  GetUserCertificateDto,
  HrmsServices,
  UserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PlaceSearchComponentComponent } from '../component/place-search-component/place-search-component.component';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    EditProfileComponent,
    PlaceSearchComponentComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  @ViewChild(EditProfileComponent) edtProfileComp!: EditProfileComponent;

  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices,
    private loadingService: LoadingService
  ) {}
  ngOnInit(): void {
    this.onGetDetails();
    this.onGetUserEducation();
    this.onGetWorkExp();
    this.onGetUserCertificate();
    this.onGetUserSkills();
  }

  isEmpty: boolean = true;
  getSkills: CreateOrEditSkillsDto[] = [];
  onGetUserSkills() {
    this.userService.getUserSkills().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.getSkills = res.data;
          this.isEmpty = this.getSkills.length === 0;
        }
        // Focus input after data loads
      },
      error: (err) => {},
    });
  }

  getCertificate: GetUserCertificateDto[] = [];
  onGetUserCertificate() {
    this.userService.getUserCertificate().subscribe({
      next: (res) => {
        this.getCertificate = res.data;
      },
    });
  }

  // Open certificate in new tab using Blob
  openCertificate(item: GetUserCertificateDto) {
    if (!item.uploadFile) return;

    try {
      // Remove data URL prefix if it exists
      let base64Data = item.uploadFile;
      if (base64Data.includes(',')) {
        base64Data = base64Data.split(',')[1];
      }

      // Convert base64 to binary
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Determine MIME type - adjust based on your file type
      const mimeType = this.getMimeType(base64Data);
      const blob = new Blob([byteArray], { type: mimeType });

      // Create blob URL and open in new tab
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');

      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error opening certificate:', error);
    }
  }

  // Detect MIME type from base64 or file signature
  getMimeType(base64Data: string): string {
    // Check file signature (magic numbers)
    if (base64Data.startsWith('/9j/')) return 'image/jpeg';
    if (base64Data.startsWith('iVBORw0KGgo')) return 'image/png';
    if (base64Data.startsWith('JVBERi0')) return 'application/pdf';
    if (base64Data.startsWith('UEs')) return 'application/zip';

    // Default to PDF
    return 'application/pdf';
  }

  getEduc: CreateOrEditEducationDto[] = [];
  onGetUserEducation() {
    this.userService.getUserEducation().subscribe({
      next: (res) => {
        this.getEduc = res.data;
      },
    });
  }

  getWorkExpData: CreateOrEditWorkExperienceDto[] = [];
  onGetWorkExp() {
    this.userService.getUserWorkExperience().subscribe({
      next: (res) => {
        this.getWorkExpData = res.data;
      },
    });
  }

  userData: UserDto = new UserDto();
  onGetDetails() {
    this.loadingService.show();
    this.userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.userData = res.data;

        this.loadingService.hide();
      },
    });
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
    // const b64 = this.userData?.userResumeByte;
    // if (!b64) return;
    // const blobUrl = this.base64ToBlobUrl(b64, 'application/pdf');
    // const win = window.open(blobUrl, '_blank', 'noopener');
    // // cleanup after 1 minute
    // setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }

  // getUserProfileImage(): string {
  //   if (this.userData && this.userData.userProfileByte) {
  //     // Convert backend byte[] (base64 string) into data URL
  //     return `data:image/jpeg;base64,${this.userData.userProfileByte}`;
  //   }
  //   // fallback image if no profile picture
  //   return 'assets/images/profile/user-5.jpg';
  // }

  // getUserCoverImage(): string {
  //   if (this.userData && this.userData.userCoverPhotoByte) {
  //     // Convert backend byte[] (base64 string) into data URL
  //     return `data:image/jpeg;base64,${this.userData.userCoverPhotoByte}`;
  //   }

  //   // fallback image if no profile picture
  //   return 'assets/images/profile/careers-cover.jpg';
  // }
  onProfileUpdated() {
    this.onGetDetails(); // Refresh the profile data
  }

  openEditDialog() {
    this.edtProfileComp.editModal = true;
  }
}
