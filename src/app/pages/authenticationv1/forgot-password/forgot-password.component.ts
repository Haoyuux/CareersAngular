import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DialogModule,
    CommonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  @ViewChild('otpContainer') otpContainer!: ElementRef;

  // Form data
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // OTP Modal
  visible1: boolean = false;
  otp: string[] = ['', '', '', '', '', ''];
  otpError: string = '';
  isVerifying: boolean = false;
  resendTimer: number = 0;
  resendInterval: any;

  datareg = {
    email: '',
  };

  onSubmit() {
    // Validate form
    if (!this.email || !this.newPassword || !this.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    // Set email for OTP modal
    this.datareg.email = this.email;

    // Send OTP to email (API call here)
    this.sendOtpToEmail();

    // Show OTP modal
    this.visible1 = true;
    this.startResendTimer();
  }

  sendOtpToEmail() {
    // TODO: Replace with your actual API call
    console.log('Sending OTP to:', this.email);
    // Example:
    // this.authService.sendOtp(this.email).subscribe(
    //   response => console.log('OTP sent successfully'),
    //   error => console.error('Error sending OTP', error)
    // );
  }

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      this.otp[index] = '';
      input.value = '';
      return;
    }

    this.otp[index] = value;

    // Move to next input if value entered
    if (value && index < 5) {
      const nextInput = input.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Clear error when user types
    if (this.otpError) {
      this.otpError = '';
    }
  }

  onOtpBackspace(event: any, index: number) {
    const input = event.target;

    if (!input.value && index > 0) {
      const prevInput = input.previousElementSibling;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData && /^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otp[index] = digit;
        }
      });

      // Focus last input
      const inputs =
        this.otpContainer.nativeElement.querySelectorAll('.otp-input');
      if (inputs[5]) {
        inputs[5].focus();
      }
    }
  }

  isOtpComplete(): boolean {
    return this.otp.every((digit) => digit !== '');
  }

  verifyOtp() {
    if (!this.isOtpComplete()) {
      this.otpError = 'Please enter all 6 digits';
      return;
    }

    this.isVerifying = true;
    const otpCode = this.otp.join('');

    // TODO: Replace with your actual API call
    console.log('Verifying OTP:', otpCode);

    // Simulate API call
    setTimeout(() => {
      // Example verification logic
      // this.authService.verifyOtpAndResetPassword(this.email, otpCode, this.newPassword).subscribe(
      //   response => {
      //     this.isVerifying = false;
      //     this.visible1 = false;
      //     alert('Password reset successfully!');
      //     // Redirect to login
      //   },
      //   error => {
      //     this.isVerifying = false;
      //     this.otpError = 'Invalid verification code';
      //   }
      // );

      // For demo
      this.isVerifying = false;
      this.visible1 = false;
      alert('Password reset successfully! (Demo)');
    }, 1500);
  }

  onSendOtp() {
    if (this.resendTimer > 0) return;

    // Resend OTP
    this.sendOtpToEmail();
    this.startResendTimer();

    // Clear OTP inputs
    this.otp = ['', '', '', '', '', ''];
    this.otpError = '';
  }

  startResendTimer() {
    this.resendTimer = 60;

    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }

    this.resendInterval = setInterval(() => {
      this.resendTimer--;

      if (this.resendTimer <= 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }
}
