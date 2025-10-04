import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillTabComponent } from './skill-tab.component';

describe('SkillTabComponent', () => {
  let component: SkillTabComponent;
  let fixture: ComponentFixture<SkillTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
