import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxToastrMessageComponent } from './services/ngx-toastr-message/ngx-toastr-message.component';
import { authService } from './services/auth-services/auth-services';

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
  constructor() {}
  title = 'Modernize Angular Admin Tempplate';

  /**
   *
   */
}
