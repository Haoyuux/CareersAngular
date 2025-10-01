import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import {
  CreateOrEditEducationDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-education-tab',
  standalone: true,
  imports: [DialogModule, CalendarModule, CommonModule, FormsModule],
  templateUrl: './education-tab.component.html',
  styleUrl: './education-tab.component.scss',
})
export class EducationTabComponent implements OnInit {
  visible: boolean = false;
  constructor(
    private userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.onGetUserEducation();
  }

  getEduc: CreateOrEditEducationDto[] = [];
  onGetUserEducation() {
    this.userService.getUserEducation().subscribe({
      next: (res) => {
        this.getEduc = res.data;
      },
    });
  }

  dataEduc: CreateOrEditEducationDto = new CreateOrEditEducationDto();
  onSaveEducation() {
    this.dataEduc.id = '00000000-0000-0000-0000-000000000000';
    this.userService.createOrEditEducation(this.dataEduc).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.visible = false;
          this.onGetUserEducation();
          this.dataEduc = new CreateOrEditEducationDto();
          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        }
      },
    });
  }

  onDeleteEducation(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this education record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.userService.deleteUserEducation(id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.onGetUserEducation();
              this.ngxToastrMessage.showtoastr(
                res.data,
                'Deleted Successfully'
              );
            } else {
              this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
            }
          },
          error: () => {
            this.ngxToastrMessage.showtoastr(
              'Failed to delete record',
              'Error'
            );
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
