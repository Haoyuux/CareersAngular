import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSearchComponentComponent } from './place-search-component.component';

describe('PlaceSearchComponentComponent', () => {
  let component: PlaceSearchComponentComponent;
  let fixture: ComponentFixture<PlaceSearchComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceSearchComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceSearchComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
