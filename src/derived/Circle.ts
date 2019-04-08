import {fabric} from "fabric";
import {ICircleOptions} from 'fabric/fabric-impl';

class Circle extends fabric.Circle{
    public objectId:string;
    constructor(objectId:string,options?:ICircleOptions){
        super(options);
        this.objectId=objectId;
    }
}

export {Circle};