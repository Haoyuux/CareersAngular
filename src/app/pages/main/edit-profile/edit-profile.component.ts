import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { UserDetailsTabComponent } from '../profile-tabs/user-details-tab/user-details-tab.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [DialogModule, CommonModule, TabViewModule, UserDetailsTabComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  editModal: boolean = false;
  constructor() {}
}
