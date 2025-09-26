import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  HrmsServices,
  UserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { PlaceSearchComponentComponent } from '../component/place-search-component/place-search-component.component';
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
    private _hrmsService: HrmsServices
  ) {}
  ngOnInit(): void {
    this.onGetDetails();
  }

  userData: UserDto = new UserDto();

  onGetDetails() {
    this.userService.getUserProfileDetails().subscribe({
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
  onProfileUpdated() {
    console.log('Profile updated, refreshing data...'); // Add this for debugging
    this.onGetDetails(); // Refresh the profile data
  }

  openEditDialog() {
    this.edtProfileComp.editModal = true;
  }
}
