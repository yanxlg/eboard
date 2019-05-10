import {fabric} from "fabric";
import {ICircleOptions} from 'fabric/fabric-impl';
import {IBrushContext} from '../interface/IBrush';
import {Common} from '../untils/Common';




class Circle extends fabric.Circle{
    public objectId:string;
    constructor(objectId:string,context:IBrushContext,options?:ICircleOptions){
        super(Common.filterParams(options,context));
        this.objectId=objectId;
    }
}

export {Circle};