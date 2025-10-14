import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import {
  CertificateTypeEnum,
  CreateOrEditCertificateDto,
  GetUserCertificateDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-certificate-tab',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, CalendarModule],
  templateUrl: './certificate-tab.component.html',
  styleUrl: './certificate-tab.component.scss',
})
export class CertificateTabComponent implements OnInit {
  visible = false;

  certificateType = CertificateTypeEnum;

  constructor(
    private userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private confirmationService: ConfirmationService
  ) {
    // alert(this.dataCert.certificateType);
  }
  ngOnInit(): void {
    this.onGetUserCertificate();
  }

  dataCert: CreateOrEditCertificateDto = new CreateOrEditCertificateDto();
  onSaveCertificate() {
    this.dataCert.id = '00000000-0000-0000-0000-000000000000';

    this.userService.createOrEditCertificate(this.dataCert).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.visible = false;
          this.onGetUserCertificate();
          this.dataCert = new CreateOrEditCertificateDto();
          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        }
      },
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

  onDeleteCertificate(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this education record?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.userService.deleteUserCertificate(id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.onGetUserCertificate();
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // this.onSaveCertificate(base64, file.name, file.type);

        this.dataCert.profileImageBase64 = base64 ?? '';
        this.dataCert.profileImageFileName = file.name ?? '';
        this.dataCert.profileImageContentType = file.type ?? '';
      };
      reader.readAsDataURL(file);
    }
  }
}
