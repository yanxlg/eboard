/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 10:16
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 10:16
 * @disc:Line
 */
import {fabric} from "fabric";
import {ILineOptions} from 'fabric/fabric-impl';
import {IBrushContext} from '../interface/IBrush';
import {Common} from '../untils/Common';
import {Point} from './Point';

class Line extends fabric.Line{
    public objectId:string;
    public startPoint:Point;
    public endPoint:Point;
    constructor(objectId:string,context:IBrushContext,points: number[], objObjects?: ILineOptions){
        super(points,Common.filterParams(objObjects,context));
        this.objectId=objectId;
        this.startPoint=new Point(points[0],points[1]);
        this.endPoint=new Point(points[2],points[3]);
    }
}

export {Line};