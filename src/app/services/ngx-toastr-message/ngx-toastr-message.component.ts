import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-ngx-toastr-message',
  standalone: true,
  imports: [ConfirmDialogModule],
  templateUrl: './ngx-toastr-message.component.html',
  styleUrl: './ngx-toastr-message.component.scss',
})
export class NgxToastrMessageComponent {
  constructor(
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

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

  confirmDelete(message: string, onAccept: () => void, onReject?: () => void) {
    this.confirmationService.confirm({
      message: message,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        onAccept();
      },
      reject: () => {
        if (onReject) {
          onReject();
        } else {
          this.showtoastrInfo('Action Cancelled', 'You cancelled the deletion');
        }
      },
    });
  }
}
