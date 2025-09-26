import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { UserDetailsTabComponent } from '../profile-tabs/user-details-tab/user-details-tab.component';
import { PlaceSearchComponentComponent } from '../component/place-search-component/place-search-component.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    TabViewModule,
    UserDetailsTabComponent,
    PlaceSearchComponentComponent,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  @Output() profileUpdated = new EventEmitter<void>();

  editModal: boolean = false;
  constructor() {}

  closeDialog() {
    this.editModal = false;
  }

  onProfileUpdated() {
    this.profileUpdated.emit(); // Pass the event up to parent
  }
}
