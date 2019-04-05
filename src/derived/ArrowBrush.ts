/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 13:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 13:15
 * @disc:ArrowBrush
 */

import {fabric} from 'fabric';
import {IBrush} from '../interface/IBrush';
import {Arrow} from './Arrow';
import {Canvas} from './Canvas';
import {LineBrush} from './LineBrush';


class ArrowBrush extends LineBrush implements IBrush{
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    public strokeDashArray:number[]=[10,4];// dot Line
    private path:any[]=[];
    constructor(canvas:Canvas){
        // @ts-ignore
        super(canvas);
    }
    
    public onMouseDown:(pointer:fabric.Point)=>void;
    public onMouseUp:()=>void;
    public onMouseMove(pointer:fabric.Point){
        this._addPoint(pointer);
        this.clear();
        this.render();
    };
    /**
     * @override
     * @param pathData
     */
    public createPath(pathData:string):any {
        console.log(pathData);
        const path = new Arrow(pathData, {
            fill: null,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray,
        });
        let position = new fabric.Point(path.left + path.width / 2, path.top + path.height / 2);
        position = path.translateToGivenOrigin(position, 'center', 'center', path.originX, path.originY);
        path.top = position.y;
        path.left = position.x;
        if (this.shadow) {
            this.shadow.affectStroke = true;
            path.setShadow(this.shadow);
        }
        return path;
    }
    public convertPointsToSVGPath(points:fabric.Point[]){
        return this.path;
    }
    private drawArrowPoints(){
        const headmen = Math.max(this.width * 2 +10,10);
        const theta = 30;
        const {x:fromX,y:fromY} = this._points[0];
        const {x:toX,y:toY} = this._points[1];
        this.path=[];
        const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headmen * Math.cos(angle1),
            topY = headmen * Math.sin(angle1),
            botX = headmen * Math.cos(angle2),
            botY = headmen * Math.sin(angle2);
    
  /*      // 取中间点，然后跟终点1/3 点
        if(mode === ArrowMode.PREV||mode === ArrowMode.ALL){
            const point1={
                x:fromX - topX,
                y:fromY - topY
            };
            const point2={
                x:fromX - botX,
                y:fromY - botY
            };
            const point3={
                x:(point1.x+point2.x)/2,
                y:(point1.y+point2.y)/2,
            };
            const point4={
                x:(fromX-point3.x)/3 + point3.x,
                y:(fromY-point3.y)/3 + point3.y,
            };
            path.splice(0,1,["M",point4.x,point4.y]);
            path.push(["M",point1.x ,point1.y]);
            path.push(["L",fromX,fromY]);
            path.push(["L",point2.x,point2.y]);
            path.push(["L",point4.x,point4.y]);
            path.push(["Z"]);
        }*/
    
        // endArrow
        const point1={
            x:toX + topX,
            y:toY + topY
        };
        const point2={
            x:toX + botX,
            y:toY + botY
        };
        const point3={
            x:(point1.x+point2.x)/2,
            y:(point1.y+point2.y)/2,
        };
        const point4={
            x:(toX-point3.x)/3 + point3.x,
            y:(toY-point3.y)/3 + point3.y,
        };
        
        this.path.push(["M",fromX,fromY," "]);
        this.path.push(["L",point4.x,point4.y," "]);
        this.path.push(["M",point1.x ,point1.y," "]);
        this.path.push(["L",toX,toY," "]);
        this.path.push(["L",point2.x,point2.y," "]);
        this.path.push(["L",point4.x,point4.y," "]);
        this.path.push(["Z"]);
        const ctx = this.canvas.contextTop;
        ctx.lineTo(point4.x, point4.y);
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(toX, toY);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point4.x, point4.y);
        ctx.closePath();
    }
    // @ts-ignore
    protected _render(){
        let ctx  = this.canvas.contextTop,
            p1 = this._points[0];
        this._saveAndTransform(ctx);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        // ctx.lineTo(p2.x, p2.y);
        this.drawArrowPoints();
        ctx.stroke();
        // ctx.fill();
        ctx.restore();
    };
}

export {ArrowBrush}