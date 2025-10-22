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

  openCertificate(item: any): void {
    if (item?.imageUrl) {
      window.open(item.imageUrl, '_blank');
    } else {
      console.warn('No certificate image found');
    }
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
        console.table(this.userData);
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
    const resumeUrl = this.userData.userResumeFile; // make sure this holds the PDF URL

    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('No résumé available.');
    }
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
