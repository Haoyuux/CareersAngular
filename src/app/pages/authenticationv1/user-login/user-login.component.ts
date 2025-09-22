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
import { TokenService } from 'src/app/services/token-service/token-service';
import { TokenStorage } from '../../../services/token-service/token-store';

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
  isLoading = false; // Add loading state

  constructor(
    private userService: UserServices,
    private authservice: authService,
    private tokenService: TokenService, // Add TokenService
    private router: Router,
    private ngxToastrMessage: NgxToastrMessageComponent
  ) {}

  data: RegisterUserDto = new RegisterUserDto();

  async onLogin() {
    // debugger;
    if (!this.data.userName || !this.data.password) {
      this.ngxToastrMessage.showtoastrInfo('Info', 'Please fill in all fields');
      return;
    }

    this.isLoading = true;
    try {
      const res = await new Promise<any>((resolve, reject) => {
        this.userService.login(this.data).subscribe({
          next: resolve,
          error: reject,
        });
      });

      if (res.isSuccess && res.data) {
        // Use TokenService instead of TokenStorage
        this.tokenService.setAuthData({
          userID: res.data.userID,
          userToken: res.data.userToken,
          newRefreshToken: res.data.newRefreshToken,
          userName: res.data.userName,
          userRole: res.data.userRole,
        });

        // Get user from TokenService
        const user = this.tokenService.getCurrentUser();
        const roles = user?.roles || [];

        if (roles.includes('Admin')) {
          this.router.navigate(['/admin/admin-dashboard']);
        } else {
          this.router.navigate(['/main/main-dashboard']);
        }

        this.ngxToastrMessage.showtoastr(
          'Success',
          'Welcome ' + res.data.userName
        );
      } else {
        this.ngxToastrMessage.showtoastrInfo(
          'Info',
          res.errorMessage || 'Login failed.'
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      this.ngxToastrMessage.showtoastrInfo(
        'Error',
        error?.message || 'Login failed. Please try again.'
      );
    } finally {
      this.isLoading = false;
    }
  }
}
