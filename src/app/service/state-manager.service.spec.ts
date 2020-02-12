import { TestBed } from '@angular/core/testing';

import { StateManagerService, StateActionType } from './state-manager.service';
import { Planet } from '../model/planet.model';
import { Vehicle } from '../model/vehicle.model';

describe('StateManagerService', () => {
  let service: StateManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(StateManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should be able to add planet to destination",()=>{
    
    // SETUP planet
    const planets = new Map<string,Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    } 
    const planet = new Planet(json);
    planets.set(planet.name,planet);
    service.planets = planets;


    service.addDestination(planet.name);


    expect(service.destination.has(planet.name)).toBeTruthy();

  })


  it("should not be able to add planet to destination if it's not in planets list", () => {

    // SETUP planet
    const planets = new Map<string, Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    }
    const planet = new Planet(json);
    planets.set(planet.name, planet);
    service.planets = planets;

    const planetname = "randomPlanet"
    service.addDestination(planetname);
    
    expect(service.destination.has(planetname)).toBeFalsy();
  })



  it("should be able to add vehicle to destination", () => {

    // SETUP planet
    const planets = new Map<string, Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    }
    const planet = new Planet(json);
    planets.set(planet.name, planet);
    service.planets = planets;


    const vehicles = new Map<string,Vehicle>();
    const vehicleJson: any ={
      name: "VehicleOne",
      total_no: 2,
      max_distance: 400,
      speed: 2,
    }
    const vehicle = new Vehicle(vehicleJson);
    vehicles.set(vehicle.name, vehicle);

    service.vehicles = vehicles;

    service.addDestination(planet.name);

    service.addVehicleToDestination(vehicle.name, planet.name)

    expect(service.destination.get(planet.name)).toBe(vehicle.name);
  })

  it("should not be able to add vehicle to destination if it doesnt exist in vehicle list", () => {

    // SETUP planet
    const planets = new Map<string, Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    }
    const planet = new Planet(json);
    planets.set(planet.name, planet);
    service.planets = planets;

    // SETUP vehicle
    const vehicles = new Map<string, Vehicle>();
    const vehicleJson: any = {
      name: "VehicleOne",
      total_no: 2,
      max_distance: 400,
      speed: 2,
    }
    const vehicle = new Vehicle(vehicleJson);
    vehicles.set(vehicle.name, vehicle);
    service.vehicles = vehicles;

    // Add planet to destination
    service.addDestination(planet.name);

    // add random vehicle to destination
    const randomVehicle = "randomVehicle";

    service.addVehicleToDestination(randomVehicle, planet.name)
    expect(service.destination.get(planet.name)).toBeNull();
  })



  it("should not be able to add vehicle to destination if it's trying to add to planet that doesn't exist", () => {

    // SETUP planet
    const planets = new Map<string, Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    }
    const planet = new Planet(json);
    planets.set(planet.name, planet);
    service.planets = planets;

    // SETUP vehicle
    const vehicles = new Map<string, Vehicle>();
    const vehicleJson: any = {
      name: "VehicleOne",
      total_no: 2,
      max_distance: 400,
      speed: 2,
    }
    const vehicle = new Vehicle(vehicleJson);
    vehicles.set(vehicle.name, vehicle);
    service.vehicles = vehicles;


    // add random vehicle to destination
    const randomPlanet = "randomPlanet";

    service.addVehicleToDestination(vehicle.name, randomPlanet);

    expect(service.destination.size).toBe(0);
  })


  it("should send observable events when planet has been added", (done) => {

    // SETUP planet
    const planets = new Map<string, Planet>();
    const json: any = {
      name: "Planet0",
      distance: 2
    }
    const planet = new Planet(json);
    planets.set(planet.name, planet);
    service.planets = planets;

    service.stateChanges.subscribe((state) => {
      expect(state).toBe(StateActionType.PLANETS_ADDED);
      done()
    })
  })

  it("should send observable events when vehicle has been added", (done) => {

    // SETUP vehicle
    const vehicles = new Map<string, Vehicle>();
    const vehicleJson: any = {
      name: "VehicleOne",
      total_no: 2,
      max_distance: 400,
      speed: 2,
    }
    const vehicle = new Vehicle(vehicleJson);
    vehicles.set(vehicle.name, vehicle);
    service.vehicles = vehicles; // Should call statechange here


    service.stateChanges.subscribe((state) => {
      expect(state as StateActionType).toEqual(StateActionType.VEHICLES_ADDED);
      done();
    })
  })
  


});
