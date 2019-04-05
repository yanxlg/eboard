/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 13:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 13:15
 * @disc:Arrow
 */
import {fabric} from "fabric";
import {IPathOptions, Point} from 'fabric/fabric-impl';

class Arrow extends fabric.Path{
    public objectId:string;
    constructor(path?: string | Point[], options?: IPathOptions) {
        super(path,options);
    }
}

export {Arrow};