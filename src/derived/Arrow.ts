/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 13:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 13:15
 * @disc:Arrow
 */
import {fabric} from "fabric";
import {IPathOptions} from 'fabric/fabric-impl';
import {IBrushContext} from '../interface/IBrush';
import {Common} from '../untils/Common';
import {Point} from './Point';

class Arrow extends fabric.Path{
    public objectId:string;
    public startPoint:Point;
    public endPoint:Point;
    constructor(objectId:string,context:IBrushContext,start:Point,end:Point,path?: string, options?: IPathOptions) {
        super(path,Common.filterParams(options,context));
        this.objectId=objectId;
        this.startPoint=start;
        this.endPoint=end||start;
    }
}

export {Arrow};