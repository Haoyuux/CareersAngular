import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationStatusComponent } from './job-application-status.component';

describe('JobApplicationStatusComponent', () => {
  let component: JobApplicationStatusComponent;
  let fixture: ComponentFixture<JobApplicationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobApplicationStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobApplicationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
