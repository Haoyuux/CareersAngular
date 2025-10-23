import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import {
  CreateOrUpdateReqSubmissionDto,
  GetRequirmentsDto,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.scss',
})
export class RequirementsComponent implements OnInit {
  constructor(
    private _hrmsService: HrmsServices,
    private userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}
  ngOnInit(): void {
    this.onGetHrmsRequirements();
  }

  // getHrmsReq: GetRequirmentsDto[] = [];
  // onGetHrmsRequirements() {
  //   this._hrmsService.getRequirements().subscribe({
  //     next: (res) => {
  //       this.getHrmsReq = res.data;
  //     },
  //   });
  // }

  getHrmsReq: GetRequirmentsDto[] = [];
  onGetHrmsRequirements() {
    this.userService.getRequirementsV1().subscribe({
      next: (res) => {
        this.getHrmsReq = res.data;

        console.table(this.getHrmsReq);
      },
    });
  }

  dataSave: CreateOrUpdateReqSubmissionDto =
    new CreateOrUpdateReqSubmissionDto();
  onUploadReq() {
    this.userService.createOrUpdateReqSubmission(this.dataSave).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
          this.onGetHrmsRequirements();
        }
      },
    });
  }

  onFileSelected(event: Event, hrmsReqCheckListId: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];

        this.dataSave.userReqFileBase64 = base64 ?? '';
        this.dataSave.userReqFileName = file.name ?? '';
        this.dataSave.userReqFileContentType = file.type ?? '';
        this.dataSave.recrtmntRequirementCheckListId = hrmsReqCheckListId;

        this.onUploadReq();
      };
      reader.readAsDataURL(file);
    }
  }

  openRequirement(requirement: any): void {
    const fileUrl = requirement?.imageUrl;

    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      this.ngxToastrMessage.showtoastr('No document available.', 'Notice');
    }
  }
}
