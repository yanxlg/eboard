/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 11:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * * @Last Modified time: 2019/4/6 11:25
 * @disc:Ellipse
 */

import {fabric} from 'fabric';
import {IEllipseOptions} from 'fabric/fabric-impl';

class Ellipse extends fabric.Ellipse{
    public objectId:string;
    constructor(objectId:string,options?: IEllipseOptions) {
        super(options);
    }
}

export {Ellipse}