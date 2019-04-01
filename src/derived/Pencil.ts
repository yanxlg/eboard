import {fabric} from "fabric";
import {IPathOptions, Point} from 'fabric/fabric-impl';

class Pencil extends fabric.Path{
    public objectId:string;
    constructor(path?: string | Point[], options?: IPathOptions){
        super(path,options);
    }
}

export {Pencil};