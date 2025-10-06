import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CreateOrEditSkillsDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';
import { NgxToastrMessageComponent } from 'src/app/services/ngx-toastr-message/ngx-toastr-message.component';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-skill-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-tab.component.html',
  styleUrl: './skill-tab.component.scss',
})
export class SkillTabComponent implements OnInit, AfterViewInit {
  @ViewChild('skillInput') skillInput!: ElementRef<HTMLInputElement>;

  dataSkills: CreateOrEditSkillsDto = new CreateOrEditSkillsDto();
  getSkills: CreateOrEditSkillsDto[] = [];
  currentSkill: string = '';
  isLoading: boolean = false;
  isEmpty: boolean = true;

  constructor(
    private _userService: UserServices,
    private ngxToastrMessage: NgxToastrMessageComponent,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.onGetUserSkills();
  }

  ngAfterViewInit() {
    this.focusInput();
  }

  onGetUserSkills() {
    this.isLoading = true;
    this._userService.getUserSkills().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.isSuccess && res.data) {
          this.getSkills = res.data;
          this.isEmpty = this.getSkills.length === 0;
        }
        // Trigger change detection and focus
        this.cdr.detectChanges();
        setTimeout(() => this.focusInput(), 0);
      },
      error: (err) => {
        this.isLoading = false;
        this.ngxToastrMessage.showtoastr('Failed to fetch skills', 'Error');
        console.error('Error fetching skills:', err);
      },
    });
  }

  onSkillKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.currentSkill.trim()) {
      event.preventDefault();
      this.addSkill();
    }
  }

  addSkill() {
    const skillName = this.currentSkill.trim();
    if (skillName) {
      const skillExists = this.getSkills.some(
        (skill) => skill.name?.toLowerCase() === skillName.toLowerCase()
      );

      if (!skillExists) {
        this.dataSkills.name = skillName;
        this.currentSkill = '';
        this.onSaveSkill();
      } else {
        this.ngxToastrMessage.showtoastr('Skill already exists', 'Warning');
        this.currentSkill = '';
        setTimeout(() => this.focusInput(), 50);
      }
    }
  }

  removeSkill(skill: CreateOrEditSkillsDto) {
    if (skill.id) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this skill?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass: 'p-button-danger',

        accept: () => {
          this._userService.deleteUserSkills(skill.id!).subscribe({
            next: (res) => {
              if (res.isSuccess) {
                this.ngxToastrMessage.showtoastr(
                  'Skill deleted successfully',
                  'Deleted Successfully'
                );
                this.onGetUserSkills();
              } else {
                this.ngxToastrMessage.showtoastr(
                  'Something went wrong',
                  'Error'
                );
              }
            },
            error: (err) => {
              this.ngxToastrMessage.showtoastr(
                'Failed to delete skill',
                'Error'
              );
              console.error('Error deleting skill:', err);
            },
          });
        },

        reject: () => {
          setTimeout(() => this.focusInput(), 50);
        },
      });
    }
  }

  focusInput() {
    if (this.skillInput?.nativeElement) {
      this.skillInput.nativeElement.focus();
    }
  }

  onSaveSkill() {
    this._userService.createOrEditSkills(this.dataSkills).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.ngxToastrMessage.showtoastr(
            'Skill added successfully',
            'Success'
          );

          this.dataSkills = new CreateOrEditSkillsDto();
          this.onGetUserSkills();
        }
      },
      error: (err) => {
        this.ngxToastrMessage.showtoastr('Failed to save skill', 'Error');
        console.error('Error saving skill:', err);
        setTimeout(() => this.focusInput(), 50);
      },
    });
  }
}
