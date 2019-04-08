/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 11:04
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 11:04
 * @disc:Point 避免浮点数
 */
import {fabric} from "fabric";

class Point extends fabric.Point{
    public length?:number;
    public radius?:number;
    public rx?:number;
    public ry?:number;
    constructor(x:number|fabric.Point,y?:number){
        super(0,0);
        if(typeof x==="number"){
            this.x=~~ (0.5 + x);
            this.y=~~ (0.5 + y);
        }else{
            this.x=~~ (0.5 + x.x);
            this.y=~~ (0.5 + x.y);
        }
    }
}

export {Point};