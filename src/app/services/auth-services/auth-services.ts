import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from './loading-services';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'auth-services',
  standalone: true,
  imports: [ProgressSpinnerModule, CommonModule],
  templateUrl: './auth-service.html',
  // styleUrl: './ngx-toastr-message.component.scss',
})
export class authService {
  constructor(private router: Router, public loadingService: LoadingService) {}

  saving: boolean = false;
  token: string | null = null;

  getUserId(): string | null {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decoded: any = jwtDecode(this.token);

      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] || null
      );
    } else {
      return null;
    }
  }

  getUserRoles(): string[] {
    this.token = localStorage.getItem('token');
    if (this.token) {
      const decoded: any = jwtDecode(this.token);

      return (
        decoded[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ] || []
      );
    } else {
      return [];
    }
  }

  onlogout() {
    localStorage.removeItem('token');

    this.router.navigate(['auth/user-login']);
  }
}

function jwtDecode(token: string): any {
  throw new Error('Function not implemented.');
}
