import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices
  ) {}
  ngOnInit(): void {
    this.onGetDetails();
  }

  onGetDetails() {
    this._hrmsService.whoAmI().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
