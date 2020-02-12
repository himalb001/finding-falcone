import { Component, OnInit } from '@angular/core';
import { WebService } from '../service/web.service';
import { map } from "rxjs/operators";
import { Vehicle } from "../model/vehicle.model";
import { Planet } from '../model/planet.model';
import { Observable } from 'rxjs';
import { StateManagerService, StateActionType } from '../service/state-manager.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';




const tokenpath = "token"
const planetsRelativePath = "planets"
const vehicleRelativePath = "vehicles"
const findFalconRelativePath = "find"


@Component({
  selector: 'fs-console',
  templateUrl: './console.component.pug',
  styleUrls: ['./console.component.styl']
})

export class ConsoleComponent implements OnInit {
  
  // Number of army changes number of destination to select from
  numberOfArmyAvailable: number[];

  // Total time taken to reach planets
  totalTime:number = 0;

  // Form shouldn't be submitted onload
  canSubmitForm:boolean = false;


  constructor(private webService: WebService, private stateManager: StateManagerService, private router:Router) {
    
    // Hardcoded to 4 army available
    this.numberOfArmyAvailable = new Array(4).fill(1);

    // Add planet to state
    this.getPlanets().subscribe((res: Map<string, Planet>) => {
      stateManager.planets = res;
    });

    // Add vehicles to state
    this.getVehicles().subscribe((res: Map<string, Vehicle>) => {
      stateManager.vehicles = res;
    });

    // Add token to state
    this.getToken().subscribe((token:string)=>{
      stateManager.token = token;
    })

    this.registerForStateChanges();

  }
  

  ngOnInit() {}

  /**
   * Registers for appropriate state changes required by the 
   * component
   */
  registerForStateChanges(){
    
    // At this stage, we only need to track 
    // DESTINATION_AMEMDED 
    this.stateManager.stateChanges.subscribe((state:StateActionType)=>{
      
      switch (state) {
        case StateActionType.DESTINATION_AMENDED:
          this.checkDestinationStatus();
          break;
        case StateActionType.AL_FALCONE_PLANET_CHANGED:
          this.redirectToPage("/result");
          default:
          break;
      }
    })
  }


  /**
   * checkDestinationStatus
   * 
   * Check if all destination contains planet and vehicles
   * and updates the total time
   */
  checkDestinationStatus(){
    const destinations = this.stateManager.destination;

    // Assumes all destination has vehicles
    let hasVehicleForAllDestination:boolean = true;

    // Vehicles go off at the same time
    // so let's not add totalTime
    let slowestShipTime = 0;


    // Check if any planet doesn't have corresponding planet
    // Also track totalTime along the way
    for (const [planetName,vehicleName] of destinations) {

      if (vehicleName){

        const planet = this.stateManager.planets.get(planetName);
        const vehicle = this.stateManager.vehicles.get(vehicleName);

        // Calculate time for ship and update if slower than others
        const timeForShip = planet.distance / vehicle.speed;
        slowestShipTime = Math.max(slowestShipTime, timeForShip);

      }else{
        
        // No value, ie - No vehicle for planet
        hasVehicleForAllDestination = false;
      }
    }

    this.totalTime = slowestShipTime;

    // Validation checks
    if(destinations.size >= 4 &&
       hasVehicleForAllDestination){
      this.canSubmitForm = true;
    }else{
      this.canSubmitForm = false;
    }


  }





  /**
   * Fetches Planets JSON and returns as an observable
   * 
   * @returns Map<string,Planet> observable
   */
  getPlanets():Observable<Map<string, Planet>> {
    return this.webService.getJSON(planetsRelativePath).pipe(
      map((res: any[]) => {
        
        // reduce array down to a single Map
        return res.reduce((map:Map<string,Planet>, planet:any)=>{
          try {
            
            // Add it to the map and return 
            const planetModel = new Planet(planet);
            return map.set(planetModel.name, planetModel);  

          } catch (error) {
            // Ignore any errors for now
            return map;
          }
          

        }, new Map<string,Planet>());

      })
    )
  }


  /**
   * Fetches Vehicles JSON and returns as an observable
   * @returns Map<string,Vehicle> observable
   */
  getVehicles(): Observable<Map<string, Vehicle>> {
    
    return this.webService.getJSON(vehicleRelativePath).pipe(
      map((res: any[]) => {
        
        // Reduce JSON array down to a map
        return res.reduce((map: Map<string, Vehicle>, vehicle: any)=> {
          try {

            // Add it to the map and return
            const vehicleModel = new Vehicle(vehicle);
            return map.set(vehicleModel.name, vehicleModel );

          } catch (error) {
            // Ignore any errors for now
            return map;
          }

        }, new Map<string, Vehicle>());

      })
    )
  }

  
  /**
   * Fetches Token JSON and returns as an observable
   * @returns String observable
   */
  getToken(): Observable<string> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }

    return this.webService.postJSON(tokenpath,httpOptions).pipe(
      map((res:any)=>{
        // Observable returns the token string only
        return res.token;
      })
    )
  }

  /**
   * Find falcone in selected destination using selected Vehicles
   */
  findFalcone(){
    this.canSubmitForm = false;
    let vehicleArray = [];
    let planetArray = [];

    // Fill arrays with names
    for (const [planetName,vehicleName] of this.stateManager.destination) {
      planetArray.push(planetName);
      vehicleArray.push(vehicleName);
    }

    const postBody = {
      token: this.stateManager.token,
      planet_names: planetArray,
      vehicle_names: vehicleArray
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    }
    
    this.webService.postJSON(findFalconRelativePath, httpOptions, postBody).subscribe((res:any)=> {
      this.canSubmitForm = true;
      // Error
      if (res.error) {
        // We can retry getting token and post again
        // For now, we'll just alert user
        this.tokenNotFoundError();
      }

      // Planet name or NULL
      let planetName:string = null;
      if (res.status == "success") {
        planetName = res.planet_name
      }
      
      this.stateManager.AlFalconePlanet = planetName;

    });
  }







  /**
   * Redirects to result page
   */
  redirectToPage(endpoint:string){
    this.router.navigate([endpoint]);
  }
  
  /**
   * Token not found error
   * 
   * This is a connection error as token 
   * should be downloaded.
   */
  tokenNotFoundError(){

    // This can move to a function for reuseability
    this.getToken().subscribe((token: string) => {
      this.stateManager.token = token;
    })

    // Implementing a simple alert for now
    alert("Connection error, please try again.");
  }
}
