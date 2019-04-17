/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 15:06
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 15:06
 * @disc:Star
 */
import {fabric} from 'fabric';
import {IPolylineOptions} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';

class Star extends fabric.Polygon{
    public objectId:string;
    public radius:number;
    constructor(objectId:string,context:IEBoardContext,radius:number,points: Array<{ x: number; y: number }>, options?: IPolylineOptions) {
        super(points, Common.filterParams(options,context));
        this.objectId = objectId;
        this.radius=radius||0;
    }
}

export {Star};