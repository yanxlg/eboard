/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 15:06
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 15:06
 * @disc:Star
 */
import {fabric} from 'fabric';
import {IPolylineOptions} from 'fabric/fabric-impl';
import {IBrushContext} from '../interface/IBrush';
import {Common} from '../untils/Common';

class Star extends fabric.Polygon{
    public objectId:string;
    public radius:number;
    constructor(objectId:string,context:IBrushContext,points: Array<{ x: number; y: number }>,radius:number, options?: IPolylineOptions) {
        super(points, Common.filterParams(options,context));
        this.objectId = objectId;
        this.radius = radius;
    }
}

export {Star};