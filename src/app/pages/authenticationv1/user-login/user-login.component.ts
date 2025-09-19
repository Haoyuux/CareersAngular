import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import {
  RegisterUserDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { authService } from 'src/app/services/auth-services/auth-services';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    NgxToastrMessageComponent,
  ],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.scss',
})
export class UserLoginComponent {
  constructor(
    private userService: UserServices,
    private authservice: authService,
    private router: Router,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}

  data: RegisterUserDto = new RegisterUserDto();
  onLogin() {
    this.userService.login(this.data).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          localStorage.setItem('token', res.data.userToken);

          // const userRole = this.authservice.getUserRoles() || 'No role';

          // // console.log(userRole);

          // if (userRole.includes('User') || userRole.includes('Admin')) {
          //   // this.router.navigate(['/admin/admin-order']);
          // } else {
          //   // this.router.navigate(['/user/userdashboard']);
          // }

          this.ngxToastrMessage.showtoastr(
            'Success',
            'Hello ' + res.data.userName
          );

          this.router.navigate(['/main/main-dashboard']);
        } else {
          this.ngxToastrMessage.showtoastrInfo('Info', res.errorMessage);
        }
      },
    });
  }
}
