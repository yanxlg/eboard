/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 11:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * * @Last Modified time: 2019/4/6 11:25
 * @disc:Ellipse
 */

import {fabric} from 'fabric';
import {IEllipseOptions} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';

class Ellipse extends fabric.Ellipse{
    public objectId:string;
    constructor(objectId:string,context:IEBoardContext,options?: IEllipseOptions) {
        super(Common.filterParams(options,context));
    }
}

export {Ellipse}