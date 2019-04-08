/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 14:51
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 14:51
 * @disc:Rect
 */
import {fabric} from 'fabric';
import {IRectOptions} from 'fabric/fabric-impl';

class Rect extends fabric.Rect{
    public objectId:string;
    constructor(objectId:string,options?: IRectOptions){
        super(options);
        this.objectId=objectId;
    }
}

export {Rect}