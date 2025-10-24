import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDashboardJobdetailsViewComponent } from './main-dashboard-jobdetails-view.component';

describe('MainDashboardJobdetailsViewComponent', () => {
  let component: MainDashboardJobdetailsViewComponent;
  let fixture: ComponentFixture<MainDashboardJobdetailsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDashboardJobdetailsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDashboardJobdetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
