import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ResultComponent } from './result.component';
import { RouterTestingModule } from '@angular/router/testing';
import { StateManagerService } from '../service/state-manager.service';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ResultComponent],
      providers: [StateManagerService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const stateManager = getTestBed().get(StateManagerService);
    
    // Create a mock destination state.
    // Else UI will redirect to /console
    let destination = new Map<string,string>();
    destination.set("random","random");
    stateManager.destination = destination;

    expect(component).toBeTruthy();
  });
});
