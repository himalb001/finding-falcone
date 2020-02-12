import { Component, OnInit } from '@angular/core';
import { StateManagerService, StateActionType } from '../service/state-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fs-result',
  templateUrl: './result.component.pug',
  styleUrls: ['./result.component.styl']
})
export class ResultComponent implements OnInit {

  timeTaken:number;
  planetFound:string;


  constructor(private stateManager:StateManagerService, private router:Router) {
      
      // get planet found
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
          // redirect view if state is cleared
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



  calculateTimeTaken(destinations: Map<string,string>){
    let slowest = 0;
    
    for (const [planetName, vehicleName] of destinations) {

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


  startButtonClicked(){
    this.stateManager.resetState();
  }


  /**
   * 
   * @param endpoint Endpoint to redirect to
   */
  redirectToPage(endpoint:string) {
    this.router.navigate([endpoint]);
  }

}
