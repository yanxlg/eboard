/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 15:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 15:12
 * @disc:StarBrush
 * 细微偏移
 */
import {fabric} from 'fabric';
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {Common} from '../untils/Common';
import {BaseBrush} from './BaseBrush';
import {Point} from './Point';
import {Star} from './Star';

class StarBrush extends BaseBrush<Star>{
    private _startPoint:Point;
    private _points:Point[]=[];
    private _radius:number;
    public static calcPointsByRadius({cx,cy}:Point,radius:number){
        const offsetAngle=54;
        const innerRadius = radius / (3-4*Math.pow(Common.sin18,2));
        // angle相对于正位置的偏角   72°间隔
        const angles=[offsetAngle,offsetAngle+36,offsetAngle+72,offsetAngle+108,offsetAngle+144,offsetAngle+180,offsetAngle+216,offsetAngle+252,offsetAngle+288,offsetAngle+324];
        
        const sinObject=[Math.sin(offsetAngle*Common.angleRatio),Math.sin((offsetAngle+36)*Common.angleRatio),
            Math.sin((offsetAngle+72)*Common.angleRatio),Math.sin((offsetAngle+108)*Common.angleRatio),
            Math.sin((offsetAngle+144)*Common.angleRatio)];// 一半值
    
        const cosObject=[Math.cos(offsetAngle*Common.angleRatio),Math.cos((offsetAngle+36)*Common.angleRatio),
            Math.cos((offsetAngle+72)*Common.angleRatio),Math.cos((offsetAngle+108)*Common.angleRatio),
            Math.cos((offsetAngle+144)*Common.angleRatio)];// 一半值
        
        return angles.map((angle:number,index:number)=>{
            const _angle = angle%360;
            const cosAngle = Math.abs(cosObject[index%5]);
            const sinAngle = Math.abs(sinObject[index%5]);
            if(index%2===0){
                // 外角
                if(_angle>0 && _angle<=90){
                    return new Point(cx + radius*cosAngle,cy + radius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new fabric.Point(cx - radius*cosAngle,cy + radius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new Point(cx - radius*cosAngle,cy - radius*sinAngle);
                }else{
                    return new Point(cx + radius*cosAngle,cy - radius*sinAngle);
                }
            }else{
                // 内角
                if(_angle>0 && _angle<=90){
                    return new Point(cx + innerRadius*cosAngle,cy + innerRadius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new Point(cx - innerRadius*cosAngle,cy + innerRadius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new Point(cx - innerRadius*cosAngle,cy - innerRadius*sinAngle);
                }else{
                    return new Point(cx + innerRadius*cosAngle,cy - innerRadius*sinAngle);
                }
            }
        });
    }
    protected onMouseDown(pointer:fabric.Point) {
        this._startPoint=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        this._reset();
    }
    protected onMouseMove(pointer:fabric.Point) {
        pointer=new Point(pointer);
        const offsetX = pointer.x-this._startPoint.x;
        const offsetY = pointer.y-this._startPoint.y;
        const absOffsetX = Math.abs(offsetX);
        const absOffsetY = Math.abs(offsetY);
        const radius = Math.min(absOffsetX,absOffsetY)/2;
        this._startPoint.cx=this._startPoint.x+radius*(offsetX>0?1:-1);
        this._startPoint.cy=this._startPoint.y+radius*(offsetY>0?1:-1);
        this._radius = radius;
        this._points = StarBrush.calcPointsByRadius(this._startPoint,this._radius);
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
        this.dispatchMessage(this.objectId,this._startPoint,this._radius);
    }
    protected onMouseUp() {
        this._finalizeAndAddPath();
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Star,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                center:this._startPoint,
                radius:this._radius,
                fill:this.fill,
                stroke: this.stroke,
                strokeWidth: this.width
            }
        });
    }
    
    private _reset() {
        this._points=[];
        this._radius=0;
        this._setBrushStyles();
        const color = new fabric.Color(this.color);
        this.needsFullRender = (color.getAlpha() < 1);
        this._setShadow();
    }
    
    protected _render() {
        let ctx  = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        const points = this._points;
        points.forEach((point,index)=>{
            if(index===0){
                ctx.moveTo(point.x,point.y);
            }else{
                ctx.lineTo(point.x,point.y);
            }
        });
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    }
    
    protected _finalizeAndAddPath(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const square = new Star(this.objectId,this.context,this._points,this._radius,{
            fill:this.fill,
            stroke:this.stroke,
            strokeWidth:this.width,
        });
        this.canvas.add(square);
        this.canvas.fire('path:created', { path: square });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
    }
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,center:Point,radius:number){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Star,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                center,
                radius,
                fill:this.fill,
                stroke: this.stroke,
                strokeWidth: this.width
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {StarBrush}