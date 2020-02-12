import { Injectable } from '@angular/core';
import { Vehicle } from '../model/vehicle.model';
import { Planet } from '../model/planet.model';
import { Observable, BehaviorSubject } from 'rxjs';

export enum StateActionType {
  VEHICLES_ADDED,
  PLANETS_ADDED,
  DESTINATION_AMENDED,
  AL_FALCONE_PLANET_CHANGED,
  STATE_CLEARED
}


@Injectable({
  providedIn: 'root'
})
/**
 * A simple application state manager 
 */
export class StateManagerService {


  private _stateChanges:BehaviorSubject<StateActionType>;

  // Private variables so stateChange can be triggered
  // in setters
  private _vehicles:Map<string,Vehicle>;
  private _planets:Map<string,Planet>;
  private _alFalconePlanet:string;

  // Token 
  token:string;
  
  // Destination pair of planet and vehicle
  destination: Map<string,string>;
  
  
  /**
   * Connection 
   */
  constructor() { 

    this._stateChanges = new BehaviorSubject<StateActionType>(null);

    // blank values
    this.destination = new Map<string,string>();
    this._vehicles = new Map<string,Vehicle>();
    this._planets = new Map<string, Planet>();

    
    this.token = "";
  }


  /**
   * addDestination
   * 
   * Add planet to the destination list
   * @param {string} planetName Name of planer
   * 
   */
  public addDestination(planetName:string) {
    const planet:Planet = this._planets.get(planetName);
    if(planet){
      planet.inUse = true;

      // change destination and notify event state
      this.destination.set(planetName, null);
      this._stateChanges.next(StateActionType.DESTINATION_AMENDED);
    }
  }



  /**
   * removeDestination
   * 
   * Removes planet from list of destination
   * 
   * @param {string} planetName Name of planet to be removed
   */
  public removeDestination(planetName:string) {

    // Increase number of vehicle available
    const vehicleName:string = this.destination.get(planetName);
    if (vehicleName && vehicleName != "") {
      this._vehicles.get(vehicleName).totalNumber++;
    }


    const planet: Planet = this._planets.get(planetName);
    planet.inUse = false;
    this.destination.delete(planetName);

    this._stateChanges.next(StateActionType.DESTINATION_AMENDED);
  }


  /**
   * 
   * Add vehicle to destination planet
   * 
   * @param {string} vehicleName Name of vehicle to add to the destination
   * @param {string} planetName Name of destination planet
   */
  public addVehicleToDestination(vehicleName:string, planetName:string) {
    const vehicle: Vehicle = this._vehicles.get(vehicleName);

    // Vehicle should exist
    if(vehicle){

      // Destination should have planet name
      if(this.destination.has(planetName)){

        this.destination.set(planetName, vehicleName);
        vehicle.totalNumber--;
        this._stateChanges.next(StateActionType.DESTINATION_AMENDED);
        
      }
    }

  }

  /**
   * Removes vehicle from destination planet
   * 
   * @param vehicleName Vehicle to remove from destination
   * @param planetName Name of planet 
   */
  public removeVehicleFromDestination(vehicleName:string, planetName:string) {
    
    // Remove it from the planet name
    this.destination.set(planetName, null);

    // Increment totalNumber of vehicle available
    const vehicle: Vehicle = this._vehicles.get(vehicleName);
    vehicle.totalNumber++;

    this._stateChanges.next(StateActionType.DESTINATION_AMENDED);
  }


  
  /**
   * Planet map
   */
  public get planets() : Map<string,Planet> {
    return this._planets;
  }
  
  /**
   * Set planets
   * @note State change is triggered by this setter
   */
  public set planets(v : Map<string,Planet>) {
    this._planets = v;
    this._stateChanges.next(StateActionType.PLANETS_ADDED);
  }

  
  public get vehicles() : Map<string,Vehicle> {
    return this._vehicles;
  }
  
  /**
  * Set vehicles
  * @note State change is triggered by this setter
  */
  public set vehicles(v: Map<string, Vehicle>) {
    this._vehicles = v;
    this._stateChanges.next(StateActionType.VEHICLES_ADDED);
  }


  /**
   * Get the Al Falcone planet
   */
  public get AlFalconePlanet() : string {
    return this._alFalconePlanet;
  }

  /**
   * Set the al falcone planet 
   * @note State change is triggered by this setter
   */
  public set AlFalconePlanet(v : string) {
    this._alFalconePlanet = v;
    this._stateChanges.next(StateActionType.AL_FALCONE_PLANET_CHANGED);
  }
  
  
  /**
   * resetState
   */
  public resetState() {
    this._alFalconePlanet = null;

    this._stateChanges.next(StateActionType.STATE_CLEARED);
  }


  /**
   * stateChanges
   * 
   * Easy way for observers to get the observable
   * 
   * @returns {Observable<StateActionType>} Observable StateActionType 
   */
  public get stateChanges() : Observable<StateActionType> {
    return this._stateChanges.asObservable();
  }
  
}
