/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 10:16
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 10:16
 * @disc:Line
 */
import {fabric} from "fabric";
import {ILineOptions} from 'fabric/fabric-impl';

class Line extends fabric.Line{
    public objectId:string;
    constructor(points?: number[], objObjects?: ILineOptions){
        super(points,objObjects);
    }
}

export {Line};