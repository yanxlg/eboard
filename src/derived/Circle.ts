import {fabric} from "fabric";
import {ICircleOptions} from 'fabric/fabric-impl';

class Circle extends fabric.Circle{
    public objectId:string;
    constructor(options?:ICircleOptions){
        super(options);
    }
}

export {Circle};