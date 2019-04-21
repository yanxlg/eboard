/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/21 14:26
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/21 14:26
 * @disc:Triangle
 */
import {fabric} from 'fabric';
import {ITriangleOptions} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';
import {Point} from './Point';

class Triangle extends fabric.Triangle{
    public objectId:string;
    public start:Point;
    public end:Point;
    constructor(objectId:string,context:IEBoardContext,start:Point,end:Point,options?: ITriangleOptions){
        super(Common.filterParams(options,context));
        this.objectId=objectId;
        this.start=start;
        this.end=end;
    }
}

export {Triangle};