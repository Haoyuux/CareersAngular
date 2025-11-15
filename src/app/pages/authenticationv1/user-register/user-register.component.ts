import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MaterialModule } from 'src/app/material.module';
import { UserDto, UserServices } from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [
    MaterialModule,
    DialogModule,
    ButtonModule, // Add this for pButton
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
})
export class UserRegisterComponent implements OnDestroy {
  constructor(private userService: UserServices) {}

  visible = false; // Terms dialog
  visible1 = false; // OTP dialog

  datareg: UserDto = new UserDto();

  otp: string[] = ['', '', '', '', '', ''];

  // New properties for enhanced UX
  otpError = '';
  isVerifying = false;
  resendTimer = 60;
  private timerInterval: any;

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // ---------------------------------------------
  // Send OTP FIRST before actual registration
  // ---------------------------------------------
  onRegister() {
    this.onSendOtp();
  }

  onSendOtp() {
    this.userService
      .sendRegistrationOtp(
        this.datareg.email!,
        this.datareg.firstName!,
        this.datareg.userName
      )
      .subscribe({
        next: (res) => {
          if (res?.isSuccess === true) {
            this.visible1 = true;
            this.otpError = '';
            this.resendTimer = 60;
            this.startResendTimer();
            this.clearOtpInputs();
          } else {
            alert(res?.errorMessage || res?.data || 'Failed to send OTP.');
          }
        },
        error: (err) => {
          alert('Failed to send OTP. Please try again.');
        },
      });
  }

  // ---------------------------------------------
  // OTP input auto-move with validation
  // ---------------------------------------------
  onOtpInput(event: any, index: number) {
    const input = event.target;
    let value = input.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = '';
      this.otp[index] = '';
      return;
    }

    if (value.length > 1) {
      value = value.charAt(0);
      input.value = value;
    }

    this.otp[index] = value;
    this.otpError = '';

    const next = input.parentElement.children[index + 1];
    if (value !== '' && next && next.tagName === 'INPUT') {
      next.focus();
    }
  }

  onOtpBackspace(event: any, index: number) {
    const input = event.target;

    if (input.value === '' && index > 0) {
      const prev = input.parentElement.children[index - 1];
      if (prev && prev.tagName === 'INPUT') {
        prev.focus();
      }
    }
  }

  // Handle paste
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '');

    if (pastedData && pastedData.length === 6) {
      for (let i = 0; i < 6; i++) {
        this.otp[i] = pastedData[i];
      }
      this.otpError = '';
      // Focus last input
      const container = (event.target as HTMLElement).parentElement;
      const lastInput = container?.children[5] as HTMLInputElement;
      lastInput?.focus();
    }
  }

  // Check if OTP is complete
  isOtpComplete(): boolean {
    return this.otp.every((digit) => digit !== '');
  }

  // ---------------------------------------------
  // VERIFY OTP (returns TRUE/FALSE)
  // ---------------------------------------------
  verifyOtp() {
    const finalOtp = this.otp.join('');
    this.isVerifying = true;
    this.otpError = '';

    this.userService.verifyOtp(this.datareg.email!, finalOtp).subscribe({
      next: (res) => {
        this.isVerifying = false;
        if (res.data == true) {
          this.visible1 = false;
          this.completeRegistration();
          if (this.timerInterval) {
            clearInterval(this.timerInterval);
          }
        } else {
          this.otpError = 'Invalid verification code. Please try again.';
          this.clearOtpInputs();
        }
      },
      error: (err) => {
        this.isVerifying = false;
        this.otpError = 'Verification failed. Please try again.';
        this.clearOtpInputs();
      },
    });
  }

  // ---------------------------------------------
  // Register AFTER OTP is validated
  // ---------------------------------------------
  completeRegistration() {
    this.userService.registerUser(this.datareg).subscribe({
      next: (res) => {
        alert('Registration successful!');
      },
      error: (err) => {
        alert('Registration failed. Please try again.');
      },
    });
  }

  // ---------------------------------------------
  // Helper methods
  // ---------------------------------------------
  private clearOtpInputs() {
    this.otp = ['', '', '', '', '', ''];
  }

  private startResendTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) {
        clearInterval(this.timerInterval);
        this.resendTimer = 0;
      }
    }, 1000);
  }
}
