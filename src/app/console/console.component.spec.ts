import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { ConsoleComponent } from './console.component';

import { WebService } from "../service/web.service";
import { StateManagerService } from "../service/state-manager.service";
import { PlanetVehicleSelectorComponent } from '../planet-vehicle-selector/planet-vehicle-selector.component';
import { environment } from 'src/environments/environment';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

import { Planet } from '../model/planet.model';
import { Vehicle } from '../model/vehicle.model';
import { RouterTestingModule } from '@angular/router/testing';



describe('ConsoleComponent', () => {
  let component: ConsoleComponent;
  let httpMock:HttpTestingController;
  let webservice: WebService;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ConsoleComponent, PlanetVehicleSelectorComponent],
      providers: [ConsoleComponent,{ provide: environment.apiBaseURL, useValue: "https://example.com/"}, WebService, StateManagerService]
    })
    .compileComponents();


  }));

  
  beforeEach(() => {
    const injector = getTestBed()
    
    httpMock = injector.get(HttpTestingController);
    webservice = injector.get(WebService);
    component = injector.get(ConsoleComponent)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Given mock JSON of right structure, 
   * expect it to return Map<string,Planet>
   * with right value
   */
  it("#getPlanets() should return Map<string,Planet> observable",(done)=>{
    component.getPlanets().subscribe((res: Map<string,Planet>)=>{
      expect(res.get("planetOne")).toBeTruthy();
      expect(res.get("randomPlanet")).toBeFalsy();
      done()
    })

    // HTTP mock
    let mocks = httpMock.match(webservice.apiBasePath + "planets");
    for (const mock of mocks) {
      mock.flush([
        { name: "planetOne", distance: 100 },
        { name: "planetTwo", distance: 200 }]);
    }
  });

  /**
   * Given mock JSON of right structure,
   * expect it to return Map<string,Vehicle>
   * with right value
   */
  it("#getVehicles() should return Map<string,Vehicle> observable", (done) => {
    component.getVehicles().subscribe((res: Map<string, Vehicle>) => {
      expect(res.get("vehicleOne")).toBeTruthy();
      expect(res.get("randomVehicle")).toBeFalsy();
      done()
    })

    // HTTP mock
    let mocks = httpMock.match(webservice.apiBasePath + "vehicles");
    for (const mock of mocks) {
      mock.flush([
        { name: "vehicleOne", total_no: 1, max_distance: 300, speed:5 },
        { name: "vehicleTwo", total_no: 2, max_distance: 30, speed:10 }]);
    }
  });

});
