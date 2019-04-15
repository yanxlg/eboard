/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 12:23
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 12:23
 * @disc:Square
 */
import {fabric} from 'fabric';
import {IRectOptions} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';

class Square extends fabric.Rect{
    public objectId:string;
    constructor(objectId:string,context:IEBoardContext,options?: IRectOptions) {
        super(Common.filterParams(options,context));
    }
    
}

export {Square}