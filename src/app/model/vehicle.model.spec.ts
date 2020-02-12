import { Vehicle } from './vehicle.model';

describe('Vehicle', () => {
  it('should create an instance', () => {
    const json:any = {
      name: "VehicleOne",
      total_no: 1,
      max_distance: 400 ,
      speed: 2,
    }
    expect(new Vehicle(json)).toBeTruthy();
  });

  it('should not create vehicle with empty json', () => {
    const json: any = {}
    expect(()=>new Vehicle(json)).toThrowError();
  });

  it('should normalise negative distance to 0', () => {
    const json: any = {
      name: "VehicleOne",
      total_no: 1,
      max_distance: -400,
      speed: 2,
    }

    expect(new Vehicle(json).maxDistance).toBe(0);
  });

  it('should normalise negative total number to 0', () => {
    const json: any = {
      name: "VehicleOne",
      total_no: -1,
      max_distance: 400,
      speed: 2,
    }

    expect(new Vehicle(json).totalNumber).toBe(0);
  });


  it('should normalise negative speed number to positive speed', () => {
    const json: any = {
      name: "VehicleOne",
      total_no: -1,
      max_distance: 400,
      speed: -2.5,
    }

    expect(new Vehicle(json).speed).toBe(2.5);
  });

});
