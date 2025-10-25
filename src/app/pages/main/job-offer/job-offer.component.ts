import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
import {
  GetUserJobOfferDtoV1,
  HrmsServices,
  UpdateJobOfferStatusDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-job-offer',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, DialogModule],
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss',
})
export class JobOfferComponent implements OnInit {
  jobOfferData: GetUserJobOfferDtoV1[] = [];
  selectedOffer: GetUserJobOfferDtoV1 | null = null;
  declineRemarks: string = '';
  visible: boolean = false;

  jobData: UpdateJobOfferStatusDto = new UpdateJobOfferStatusDto();

  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.onGetUserJobOffer();
  }

  onGetUserJobOffer() {
    this.loadingService.show();
    this.userService.getUserJobOffer().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.jobOfferData = res.data;

          console.table(this.jobOfferData);
        }
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error fetching job offers:', err);
        this.loadingService.hide();
      },
    });
  }

  // Get status class for rejection status
  getRejectStatusClass(isRejected: boolean | null | undefined): string {
    if (isRejected === null || isRejected === undefined) {
      return 'status-pending';
    }
    return isRejected ? 'status-declined' : 'status-accepted';
  }

  // Get status class for confirmation status
  getConfirmStatusClass(isConfirmed: boolean | null | undefined): string {
    if (isConfirmed === null || isConfirmed === undefined) {
      return 'status-pending';
    }
    return isConfirmed ? 'status-confirmed' : 'status-not-confirmed';
  }

  // Format date to short format (e.g., "Nov 15, 2025")
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Format date to full format (e.g., "November 15, 2025")
  formatFullDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Convert base64 PDF to safe URL for iframe
  getPdfUrl(pdfByte: string | undefined): SafeResourceUrl {
    if (!pdfByte) return '';
    const pdfData = `data:application/pdf;base64,${pdfByte}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdfData);
  }

  // Download PDF
  downloadPDF(offer: GetUserJobOfferDtoV1) {
    if (!offer.pdfByte) return;

    const byteCharacters = atob(offer.pdfByte);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Offer_Letter_${offer.jobTitle.replace(/\s+/g, '_')}.pdf`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  // View PDF in fullscreen
  viewFullScreen(offer: GetUserJobOfferDtoV1) {
    if (!offer.pdfByte) return;

    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(
        `<iframe width='100%' height='100%' src='data:application/pdf;base64,${offer.pdfByte}'></iframe>`
      );
    }
  }

  // Accept offer
  acceptOffer(offer: GetUserJobOfferDtoV1) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit your response?',
      header: 'Confirm Response',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',

      accept: () => {
        this.jobData.isRejected = false;
        this.jobData.rejectionRemarks = '';
        this.jobData.contractId = offer.contractId;

        this.userService.updateJobOfferStatus(this.jobData).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              // this.onGetUserEducation();

              // this.jobData.rejectionRemarks = this.declineRemarks;

              this.visible = false;
              this.selectedOffer = null;
              this.declineRemarks = '';
              this.ngxToastrMessage.showtoastr(
                res.data,
                'Response Sent Successfully'
              );

              this.onGetUserJobOffer();
            } else {
              this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
            }
          },
          error: (err) => {
            this.ngxToastrMessage.showtoastr('Failed to submit response', err);
          },
        });
      },

      reject: () => {
        // this.ngxToastrMessage.showtoastr(
        //   'You cancelled the deletion',
        //   'Action Cancelled'
        // );
      },
    });
  }

  // Open decline dialog with selected offer
  openDeclineDialog(offer: GetUserJobOfferDtoV1) {
    this.selectedOffer = offer;
    this.declineRemarks = '';
    this.visible = true;
  }

  onSubmitDecline() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit your response?',
      header: 'Confirm Response',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',

      accept: () => {
        this.jobData.rejectionRemarks = this.declineRemarks;
        this.jobData.isRejected = true;
        this.jobData.contractId = this.selectedOffer!.contractId;
        this.userService.updateJobOfferStatus(this.jobData).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              // this.onGetUserEducation();

              this.visible = false;
              this.selectedOffer = null;
              this.declineRemarks = '';
              this.ngxToastrMessage.showtoastr(
                res.data,
                'Response Sent Successfully'
              );

              this.onGetUserJobOffer();
            } else {
              this.ngxToastrMessage.showtoastr('Something went wrong', 'Error');
            }
          },
          error: (err) => {
            this.ngxToastrMessage.showtoastr('Failed to submit response', err);
          },
        });
      },

      reject: () => {
        // this.ngxToastrMessage.showtoastr(
        //   'You cancelled the deletion',
        //   'Action Cancelled'
        // );
      },
    });
  }
}
