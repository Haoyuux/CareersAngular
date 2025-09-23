import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  ApiResponseMessageOfgetUserProfileDetailsDto,
  GetUserProfileDetailsDto,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule, CommonModule, EditProfileComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  // @ViewChild(EditProfileComponent) edtProfileComp!: EditProfileComponent;

  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices
  ) {}
  ngOnInit(): void {
    this.onGetDetails();
  }

  userData: GetUserProfileDetailsDto = new GetUserProfileDetailsDto();
  onGetDetails() {
    this.userService.getUserProfileDetails().subscribe({
      next: (res) => {
        this.userData = res.data;
        console.log(res);
      },
    });
  }
}
