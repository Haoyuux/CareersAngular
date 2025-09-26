import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSearchComponentV1Component } from './place-search-component-v1.component';

describe('PlaceSearchComponentV1Component', () => {
  let component: PlaceSearchComponentV1Component;
  let fixture: ComponentFixture<PlaceSearchComponentV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceSearchComponentV1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceSearchComponentV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
