/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 15:06
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 15:06
 * @disc:Star
 */
import {fabric} from 'fabric';
import {IPolylineOptions} from 'fabric/fabric-impl';

class Star extends fabric.Polygon{
    public objectId:string;
    constructor(objectId:string,points: Array<{ x: number; y: number }>, options?: IPolylineOptions) {
        super(points, options);
        this.objectId = objectId;
    }
}

export {Star};