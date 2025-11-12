import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { authService } from 'src/app/services/auth-services/auth-services';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { UserServices } from 'src/app/services/nswag/service-proxie';
import { TokenService } from 'src/app/services/token-service/token-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    MaterialModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(
    private authservice: authService,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private router: Router,
    private _userService: UserServices,
    private tokenService: TokenService
  ) {}

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getCurrentUser() {
    return this.tokenService.getCurrentUser();
  }

  onLogin() {
    this.router.navigate(['/user-authentication/user-login']);
  }

  onClickLogout() {
    this.authservice.onlogout();
    this.ngxToastrMessage.showtoastr('Logout Successfully', 'Good Bye');
    this.router.navigate(['/user-authentication/user-login']);
  }

  onRegister() {
    this.router.navigate(['/user-authentication/user-register']);
  }

  async onLogout() {
    try {
      await this._userService.logout().toPromise();

      await this.tokenService.logout();

      this.ngxToastrMessage.showtoastr('Logout Successfully', 'Good Bye');
    } catch (error) {
      console.error('[Logout] Error:', error);
      // Still logout locally even if backend fails
      await this.tokenService.logout();
      this.ngxToastrMessage.showtoastr('Logout Successfully', 'Good Bye');
    }
  }
}
