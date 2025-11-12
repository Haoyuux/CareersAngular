import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxToastrMessageComponent } from './services/ngx-toastr-message/ngx-toastr-message.component';
import { authService } from './services/auth-services/auth-services';
import { TokenService } from './services/token-service/token-service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxToastrMessageComponent, authService],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Brigada Careers 3.0';

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    // Wait for token service to initialize before handling navigation
    this.tokenService.isInitialized$
      .pipe(
        filter((initialized) => initialized),
        take(1)
      )
      .subscribe(() => {
        // Only redirect if currently on root path
        const currentUrl = this.router.url;
        if (currentUrl === '/' || currentUrl === '') {
          this.router.navigate(['/main/main-dashboard']);
        }
      });
  }
}
