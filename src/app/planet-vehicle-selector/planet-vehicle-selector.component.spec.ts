import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetVehicleSelectorComponent } from './planet-vehicle-selector.component';

describe('PlanetVehicleSelectorComponent', () => {
  let component: PlanetVehicleSelectorComponent;
  let fixture: ComponentFixture<PlanetVehicleSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanetVehicleSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanetVehicleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
