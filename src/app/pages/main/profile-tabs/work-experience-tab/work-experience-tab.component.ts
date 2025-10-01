import { Component, OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { PlaceSearchComponentV1Component } from '../../component/place-search-component-v1/place-search-component-v1.component';
import {
  CreateOrEditWorkExperienceDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { ConfirmationService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-experience-tab',
  standalone: true,
  imports: [
    DialogModule,
    CalendarModule,
    PlaceSearchComponentV1Component,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './work-experience-tab.component.html',
  styleUrl: './work-experience-tab.component.scss',
})
export class WorkExperienceTabComponent implements OnInit {
  visible: boolean = false;

  userData: string = '';

  constructor(
    private userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.onGetWorkExp();
  }

  getWorkExpData: CreateOrEditWorkExperienceDto[] = [];
  onGetWorkExp() {
    this.userService.getUserWorkExperience().subscribe({
      next: (res) => {
        this.getWorkExpData = res.data;
      },
    });
  }

  dataWorkExp: CreateOrEditWorkExperienceDto =
    new CreateOrEditWorkExperienceDto();
  onSaveWorkExp() {
    const address = (this.dataWorkExp.companyAddress ?? '').trim();

    this.dataWorkExp.companyAddress = address;

    if (!address) {
      this.ngxToastrMessage.showtoastrInfo(
        'Please select or type a location.',
        'Validation'
      );
      return;
    }

    this.dataWorkExp.id = '00000000-0000-0000-0000-000000000000';
    this.userService.createOrEditWorkExperience(this.dataWorkExp).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.visible = false;
          this.onGetWorkExp();
          this.dataWorkExp = new CreateOrEditWorkExperienceDto();
          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        }
      },
    });
  }

  onDeleteWorkExp(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this work experience record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.userService.deleteUserWorkExperience(id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.onGetWorkExp();
              this.ngxToastrMessage.showtoastr(
                res.data,
                'Deleted Successfully'
              );
            } else {
              this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
            }
          },
          error: (err) => {
            this.ngxToastrMessage.showtoastr('Failed to delete record', err);
          },
        });
      },

      reject: () => {
        // this.ngxToastrMessage.showtoastr(
        //   'You cancelled the deletion',
        //   'Action Cancelled'
        // );
      },
    });
  }
}
