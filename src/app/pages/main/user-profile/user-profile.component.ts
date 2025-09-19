import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {}
