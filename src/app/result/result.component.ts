import { Component, OnInit } from '@angular/core';
import { StateManagerService, StateActionType } from '../service/state-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fs-result',
  templateUrl: './result.component.pug',
  styleUrls: ['./result.component.styl']
})
export class ResultComponent implements OnInit {
  // Time taken
  timeTaken:number;
  planetFound:string;


  constructor(private stateManager:StateManagerService, private router:Router) {
      
      // @note - planetFound can be null too!
      this.planetFound = this.stateManager.AlFalconePlanet;

      // Get destination list and calculate timetaken
      const destination = this.stateManager.destination;

      // If destination size is less than 0, 
      // it means user have come to the page directly
      if(destination.size  <=0){
        this.redirectToPage("/console");
      }


      this.timeTaken = this.calculateTimeTaken(destination);

      // Wait for any reset state change
      this.stateManager.stateChanges.subscribe(state=>{
        switch (state) {
          // Redirect to console if state is cleared
          case StateActionType.STATE_CLEARED:
            this.redirectToPage("/console");
            break;
          default:
            break;
        }
      })
   }

  ngOnInit() {

  }


  /**
   * 
   * Given the destination map, this function will
   * calculate time taken for shis to get to the planet
   * 
   * Ships are imagined to take off simultaneously
   * 
   * @param destinations Destination list
   * 
   */
  calculateTimeTaken(destinations: Map<string,string>):number{
    let slowest = 0;
    
    for (const [planetName, vehicleName] of destinations) {
      // Calculate only if vehicle exists
      if (vehicleName) {

        const planet = this.stateManager.planets.get(planetName);
        const vehicle = this.stateManager.vehicles.get(vehicleName);

        // Calculate time for ship and update if slower than others
        const timeForShip = planet.distance / vehicle.speed;
        slowest = Math.max(slowest, timeForShip);
        
      }
    }
    return slowest;
  }


  /**
   * Start button clicked in UI
   * 
   * @description This function will change the state in statemanager
   * All subscribed components will react automatically
   */
  startButtonClicked(){
    this.stateManager.resetState();
  }


  /**
   * 
   * @param endpoint Endpoint to redirect the page to 
   */
  redirectToPage(endpoint:string) {
    this.router.navigate([endpoint]);
  }
  
  
}
