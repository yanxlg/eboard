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
    public cx?:number;
    public cy?:number;
    constructor(x:number|fabric.Point,y?:number){
        super(0,0);
        if(typeof x==="number"){
            this.x=this.cx=~~ (0.5 + x);
            this.y=this.cy=~~ (0.5 + y);
        }else{
            this.x=this.cx=~~ (0.5 + x.x);
            this.y=this.cy=~~ (0.5 + x.y);
        }
        this.radius=0;
        this.rx=0;
        this.ry=0;
        this.length=0;
    }
}

export {Point};