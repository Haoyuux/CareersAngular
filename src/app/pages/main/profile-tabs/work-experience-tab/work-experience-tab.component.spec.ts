import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkExperienceTabComponent } from './work-experience-tab.component';

describe('WorkExperienceTabComponent', () => {
  let component: WorkExperienceTabComponent;
  let fixture: ComponentFixture<WorkExperienceTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkExperienceTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkExperienceTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
