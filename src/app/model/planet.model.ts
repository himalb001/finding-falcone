export class Planet {

    name: string;
    distance: number;
    inUse: boolean = false;


    constructor(json: any) {

        if (!json) { throw new Error("EmptyArgsError - Empty args") }

        const name = json.name || null;
        const distance = parseInt(json.distance);
        
        // Values check
        if(name == null || isNaN(distance) || distance <= 0){
            throw new Error("InvalidValueError - Invalid values.");
        }else{
            this.name = name;
            this.distance = distance;
        }
        
    }
}