/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 12:23
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 12:23
 * @disc:Square
 */
import {fabric} from 'fabric';
import {IRectOptions} from 'fabric/fabric-impl';

class Square extends fabric.Rect{
    public objectId:string;
    constructor(objectId:string,options?: IRectOptions) {
        super(options);
    }
    
}

export {Square}