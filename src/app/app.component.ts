import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxToastrMessageComponent } from './services/ngx-toastr-message/ngx-toastr-message.component';
import { authService } from './services/auth-services/auth-services';
import { loadingService } from './services/auth-services/LoadingService';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxToastrMessageComponent, authService],
  templateUrl: './app.component.html',
})
export class AppComponent {
  /**
   *
   */
  constructor(public loadingService: loadingService) {}
  title = 'Modernize Angular Admin Tempplate';

  /**
   *
   */
}
