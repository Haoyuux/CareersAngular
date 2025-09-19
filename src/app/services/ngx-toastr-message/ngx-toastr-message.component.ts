import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ngx-toastr-message',
  standalone: true,
  imports: [],
  templateUrl: './ngx-toastr-message.component.html',
  styleUrl: './ngx-toastr-message.component.scss',
})
export class NgxToastrMessageComponent {
  constructor(private toastr: ToastrService) {}

  showtoastr(title: string, message: string) {
    this.toastr.success(message, title, {
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  showtoastrInfo(title: string, message: string) {
    this.toastr.info(message, title, {
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
}
