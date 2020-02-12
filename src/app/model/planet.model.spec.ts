import { Planet } from './planet.model';

describe('Planet', () => {
  it('should create an instance with right JSON', () => {

    const planetJSON = {
      name: "Donlon",
      distance: 200
    }
    expect(new Planet(planetJSON)).toBeTruthy();
  });


  it('should not create planet with empty json', () => {
    const json: any = {}
    expect(() =>new Planet(json)).toThrowError();
  });

  it('should not create vehicle with negative distance', () => {
    const json: any = {
      name: "Planet0",
      distance: -2
    }
    expect(() =>new Planet(json)).toThrowError();
  });

  it('should not create vehicle with non-numeric distance', () => {
    const json: any = {
      name: "Planet",
      distance: "abc"
    }
    expect(()=>new Planet(json)).toThrowError();
  });

});
