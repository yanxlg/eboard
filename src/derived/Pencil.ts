import {fabric} from "fabric";
import {IPathOptions, Point} from 'fabric/fabric-impl';

class Pencil extends fabric.Path{
    public objectId:string;
    constructor(objectId:string,path?: string | Point[], options?: IPathOptions){
        super(path,options);
        this.objectId=objectId;
    }
}

export {Pencil};