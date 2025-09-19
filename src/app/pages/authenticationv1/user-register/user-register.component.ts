import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [MaterialModule, DialogModule, RouterLink],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss',
})
export class UserRegisterComponent {
  visible: boolean = false;
}
