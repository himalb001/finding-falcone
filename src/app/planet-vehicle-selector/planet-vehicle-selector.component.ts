import { Component, OnInit } from '@angular/core';
import { StateManagerService, StateActionType } from '../service/state-manager.service';
import { Planet } from '../model/planet.model';
import { Vehicle } from '../model/vehicle.model';

@Component({
  selector: 'fs-planet-vehicle-selector',
  templateUrl: './planet-vehicle-selector.component.pug',
  styleUrls: ['./planet-vehicle-selector.component.styl']
})
export class PlanetVehicleSelectorComponent implements OnInit {

  // Planet dropdown visibility
  planetListVisible:boolean = false;

  // Selected plant and vehicle
  selectedPlanet: Planet = null;
  selectedVehicle: Vehicle = null;

  // List of planets and vehicles
  planets: Map<string,Planet>;
  vehicles:Map<string, Vehicle>;


  constructor( private stateManager: StateManagerService) { 

    // Get existing states
    this.planets = this.getPlanets();
    this.vehicles = this.getVehicles();

    // Register for state changes
    this.registerForStateChanges();

  }


  /**
   * Register for appropriate changes required for
   * the component
   */
  registerForStateChanges(){

    // Add listeners from stateManager
    this.stateManager.stateChanges.subscribe((stateType) => {
      switch (stateType) {
        case StateActionType.STATE_CLEARED:
          this.removePlanet();
          break;
        case StateActionType.PLANETS_ADDED:
          this.planets = this.getPlanets();
          break;
        case StateActionType.VEHICLES_ADDED:
          this.vehicles = this.getVehicles();
        default:
          break;
      }
    })
    
  }



  ngOnInit() {}

  /**
   * This function is called when user selects a 
   * planet name from UI
   * 
   * @param planetName Planet name
   */
  planetValueChanged(planetName:string){
    // remove existing planet before adding
    this.removePlanet();
    if(planetName != ""){
      this.addPlanet(planetName);
    }

    // close planet dropdown list
    this.togglePlanetList();

  }


  /**
   * This function is called when user selects 
   * a vehicle in the UI
   * 
   * @param vehicleName 
   */
  vehicleValueChanged(vehicleName:string){
      this.addVehicleToPlanet(vehicleName);
  }


  /**
   * Add planet as destination
   * 
   * @param planetName Planet to add to the selector
   */
  addPlanet(planetName: string){
    this.selectedPlanet = this.planets.get(planetName);
    this.stateManager.addDestination(planetName);
  }

  /**
   * Remove planet from the selector
   */
  removePlanet() {
    if (this.selectedPlanet) {
      
      // Remove selected vehicle
      if(this.selectedVehicle){
        this.removeVehicleFromPlanet(this.selectedVehicle.name);
      }
      
      this.stateManager.removeDestination(this.selectedPlanet.name);
      this.selectedPlanet = null;
    }
  }


  /**
   * Adds given vehicle to planet
   * 
   * @param vehicleName Vehicle name to add to planet
   */
  addVehicleToPlanet(vehicleName: string) {
    if (this.selectedPlanet) {

      // Remove existing vehicle if there's one
      if(this.selectedVehicle){
        this.removeVehicleFromPlanet(this.selectedVehicle.name);
      }

      this.stateManager.addVehicleToDestination(vehicleName, this.selectedPlanet.name);
      this.selectedVehicle = this.vehicles.get(vehicleName);
    }
  }


  /**
   * Remove given vehicle from planet
   * 
   * @param vehicleName Vehicle to be removed from planet
   */
  removeVehicleFromPlanet(vehicleName:string) {
    if (this.selectedPlanet && vehicleName != "") {
      
      this.stateManager.removeVehicleFromDestination(vehicleName,this.selectedPlanet.name);
      this.selectedVehicle = null;
    }
  }


  /**
   * Fetch list of vehicles from statemanager
   */
  getVehicles() : Map<string,Vehicle>{
    return this.stateManager.vehicles;
  }

  /**
   * Fetch list of planets from statemanager
   */
  getPlanets(): Map<string, Planet> {
    return this.stateManager.planets;
  }


  /**
   * Toggle planet dropdown list
   */
  public togglePlanetList(){
    this.planetListVisible = !this.planetListVisible;
  }
}
