import {
  Component,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule, NgClass } from '@angular/common';
import { TokenService } from 'src/app/services/token-service/token-service';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [TranslateModule, MaterialModule, CommonModule, NgClass],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(
    public navService: NavService,
    public router: Router,
    private tokenService: TokenService // ✅ Inject TokenService
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    this.navService.currentUrl.subscribe((url: string) => {});
  }

  onItemSelected(item: NavItem) {
    this.router.navigate([item.route]);

    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  onSubItemSelected(item: NavItem) {}

  // ✅ Add method to check if user can see this item
  canShowItem(): boolean {
    // If no roles specified, show to everyone
    if (!this.item.roles || this.item.roles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    const currentUser = this.tokenService.getCurrentUser();
    const userRoles = currentUser?.roles || [];

    return this.item.roles.some((role: string) => userRoles.includes(role));
  }
}
