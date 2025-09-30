import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import {
  CreateOrEditEducationDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-education-tab',
  standalone: true,
  imports: [DialogModule, CalendarModule, CommonModule, FormsModule],
  templateUrl: './education-tab.component.html',
  styleUrl: './education-tab.component.scss',
})
export class EducationTabComponent {
  visible: boolean = false;
  constructor(
    private userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}

  dataEduc: CreateOrEditEducationDto = new CreateOrEditEducationDto();
  onSaveEducation() {
    debugger;
    this.dataEduc.id = '';
    this.userService.createOrEditEducation(this.dataEduc).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.visible = false;

          this.ngxToastrMessage.showtoastr(res.data, 'Updated Successfully');
        }
      },
    });
  }
}
