import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
import {
  GetUserJobOfferDtoV1,
  HrmsServices,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-offer',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss',
})
export class JobOfferComponent implements OnInit {
  constructor(
    private userService: UserServices,
    private _hrmsService: HrmsServices,
    private loadingService: LoadingService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.onGetUserJobOffer();
  }

  jobOfferData: GetUserJobOfferDtoV1[] = [];

  onGetUserJobOffer() {
    this.loadingService.show();
    this.userService.getUserJobOffer().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.jobOfferData = res.data;
          console.table(res);
        }
        this.loadingService.hide();
      },
      error: (err) => {
        console.error('Error fetching job offers:', err);
        this.loadingService.hide();
      },
    });
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

  // Accept offer - Add your logic here
  acceptOffer(offer: GetUserJobOfferDtoV1) {
    // TODO: Implement accept offer logic
    console.log('Accepting offer:', offer);
    // Example:
    // this._hrmsService.acceptJobOffer(offer.contractId).subscribe({
    //   next: (res) => {
    //     if (res.isSuccess) {
    //       this.onGetUserJobOffer(); // Refresh data
    //     }
    //   }
    // });
  }

  // Decline offer - Add your logic here
  declineOffer(offer: GetUserJobOfferDtoV1) {
    // TODO: Implement decline offer logic with remarks
    console.log('Declining offer:', offer);
    // You might want to open a dialog to get rejection remarks
    // Example:
    // this._hrmsService.declineJobOffer(offer.contractId, remarks).subscribe({
    //   next: (res) => {
    //     if (res.isSuccess) {
    //       this.onGetUserJobOffer(); // Refresh data
    //     }
    //   }
    // });
  }
}
