
export class Vehicle {
    name:string;
    totalNumber:number;
    maxDistance:number;
    speed:number;

    constructor(json:any){
        if (!json) { throw new Error("EmptyArgsError - Empty args") }
        
        const name = json.name || null;
        const totalNumber = parseInt(json.total_no);
        const maxDistance = parseFloat(json.max_distance);
        const speed = parseFloat(json.speed);

        // Making sure non of these are blank
        if (name == null || isNaN(totalNumber) || isNaN(maxDistance) || isNaN(speed)) {
            throw new Error("Invalid Value Error - Invalid values.")
        }else{
            this.name = name;
            // Numbers below shouldn't be less than 0
            this.totalNumber = Math.max(totalNumber, 0);
            this.maxDistance = Math.max(maxDistance, 0);
            this.speed = Math.abs(speed);
        }


        
    }
}
