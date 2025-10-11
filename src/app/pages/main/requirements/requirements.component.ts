import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GetRequirmentsDto,
  HrmsServices,
} from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-requirements',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './requirements.component.html',
  styleUrl: './requirements.component.scss',
})
export class RequirementsComponent implements OnInit {
  constructor(private _hrmsService: HrmsServices) {}
  ngOnInit(): void {
    this.onGetHrmsRequirements();
  }

  getHrmsReq: GetRequirmentsDto[] = [];
  onGetHrmsRequirements() {
    this._hrmsService.getRequirements().subscribe({
      next: (res) => {
        this.getHrmsReq = res.data;
      },
    });
  }
}
