import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';
import { UserDto, UserServices } from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [
    MaterialModule,
    DialogModule,
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
})
export class UserRegisterComponent {
  visible: boolean = false;

  constructor(private userService: UserServices) {}

  datareg: UserDto = new UserDto();
  onRegister() {
    this.userService.registerUser(this.datareg).subscribe({
      next: (res) => {},
    });
  }
}
