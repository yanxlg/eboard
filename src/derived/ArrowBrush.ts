/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 13:15
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 13:15
 * @disc:ArrowBrush
 */

import {fabric} from 'fabric';
import {Arrow} from './Arrow';
import {LineBrush} from './LineBrush';

export enum ArrowType{
    Prev="prev",
    Next="next",
    All="all"
}

class ArrowBrush extends LineBrush{
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    private arrowOffset:number=10;
    private theta:number=30;
    private arrowType:ArrowType=ArrowType.Next;
    public strokeDashArray:number[]=undefined;// dot Line
    public convertPointsToSVGPath(){
        let p1 = this._startPointer,
            p2 = this._endPointer||this._startPointer;
        const headmen = Math.max(this.width * 2 +this.arrowOffset,this.arrowOffset);
        const theta = this.theta;
        const {x:fromX,y:fromY} = p1;
        const {x:toX,y:toY} = p2;
        const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headmen * Math.cos(angle1),
            topY = headmen * Math.sin(angle1),
            botX = headmen * Math.cos(angle2),
            botY = headmen * Math.sin(angle2);
        let path:any= [];
        if(this.arrowType === ArrowType.Prev||this.arrowType === ArrowType.All){
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
            path.splice(0,1,["M",point4.x,point4.y," "]);
            path.push(["M",point1.x ,point1.y," "]);
            path.push(["L",fromX,fromY," "]);
            path.push(["L",point2.x,point2.y," "]);
            path.push(["L",point4.x,point4.y," "]);
            path.push(["Z"," "]);
    
    
            path.push(["M",point1.x ,point1.y," "]);
            path.push(["L",fromX,fromY," "]);
            path.push(["L",point2.x,point2.y," "]);
            path.push(["L",point4.x,point4.y," "]);
            path.push(["Z"," "]);
            path.push(["M",point4.x,point4.y," "]);
        }else{
            path.push(["M",fromX,fromY," "]);
        }
        if(this.arrowType === ArrowType.Next||this.arrowType === ArrowType.All){
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
            path.push(["L",point4.x,point4.y," "]);
            path.push(["M",point1.x ,point1.y," "]);
            path.push(["L",toX,toY," "]);
            path.push(["L",point2.x,point2.y," "]);
            path.push(["L",point4.x,point4.y," "]);
            path.push(["Z"]);
        }else{
            path.push("L",toX,toY," ");
            path.push(["Z"]);
        }
        return path;
    }
    public createPath(pathData?:string):any {
        const path = new Arrow(this.objectId,pathData, {
            stroke: this.stroke,
            fill:this.stroke,
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
    protected _finalizeAndAddPath(){
        const ctx = this.canvas.contextTop;
        ctx.closePath();
        const pathData = this.convertPointsToSVGPath().join('');
        if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
            this.canvas.requestRenderAll();
            return;
        }
        const path = this.createPath(pathData);
        this.canvas.clearContext(this.canvas.contextTop);
        this.canvas.add(path);
        this.canvas.renderAll();
        path.setCoords();
        this._resetShadow();
        this.canvas.fire('path:created', { path});
    }
    private drawArrowPoints(start:fabric.Point,end:fabric.Point){
        const headmen = Math.max(this.width * 2 +this.arrowOffset,this.arrowOffset);
        const theta = this.theta;
        const {x:fromX,y:fromY} = start;
        const {x:toX,y:toY} = end;
        const angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headmen * Math.cos(angle1),
            topY = headmen * Math.sin(angle1),
            botX = headmen * Math.cos(angle2),
            botY = headmen * Math.sin(angle2);
        
        const ctx = this.canvas.contextTop;
        
        if(this.arrowType === ArrowType.Prev||this.arrowType === ArrowType.All){
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
            ctx.moveTo(point1.x,point1.y);
            ctx.lineTo(fromX,fromY);
            ctx.lineTo(point2.x,point2.y);
            ctx.lineTo(point4.x,point4.y);
            ctx.closePath();
            // ctx.stroke();
            ctx.moveTo(point4.x,point4.y);
        }else{
            ctx.moveTo(fromX,fromY);
        }
    
        if(this.arrowType === ArrowType.Next||this.arrowType === ArrowType.All){
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
    
            ctx.lineTo(point4.x, point4.y);
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(toX, toY);
            ctx.lineTo(point2.x, point2.y);
            ctx.lineTo(point4.x, point4.y);
            ctx.closePath();
        }else{
            ctx.lineTo(toX,toY);
        }
        ctx.closePath();
    }
    // @ts-ignore
    protected _render(){
        let ctx  = this.canvas.contextTop,
            p1 = this._startPointer,
            p2 = this._endPointer||this._startPointer;
        const oldFillColor = ctx.fillStyle;
        ctx.strokeStyle=this.stroke;
        ctx.fillStyle=ctx.strokeStyle;
        this._saveAndTransform(ctx);
        ctx.beginPath();
        if (p1 && p2 && p1.x === p2.x && p1.y === p2.y) {
            const width = this.width / 1000;
            p1.x -= width;
            p2.x += width;
        }
        this.drawArrowPoints(p1,p2);
        ctx.stroke();
        ctx.fill();
        ctx.restore();
        ctx.fillStyle=oldFillColor;
    };
}

export {ArrowBrush}