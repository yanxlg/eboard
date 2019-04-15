import {fabric} from "fabric";
import {IPathOptions, Point} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';

class Pencil extends fabric.Path{
    public objectId:string;
    constructor(objectId:string,context:IEBoardContext,path?: string | Point[], options?: IPathOptions){
        super(path,Common.filterParams(options,context));
        this.objectId=objectId;
    }
}

export {Pencil};