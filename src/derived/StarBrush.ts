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
import {MessageTag} from '../static/MessageTag';
import {Common} from '../untils/Common';
import {BaseBrush} from './BaseBrush';
import {Point} from './Point';
import {Quadrant} from './SquareBrush';
import {Star} from './Star';

class StarBrush extends BaseBrush<Star>{
    private _startPoint:Point;
    private _points:Point[]=[];
    private calcQuadrant(point:{x:number,y:number}){
        if(point.x>=this._startPoint.x){
            if(point.y>=this._startPoint.y){
                return Quadrant.RB;
            }else{
                return Quadrant.RT;
            }
        }else{
            // 左侧
            if(point.y>=this._startPoint.y){
                return Quadrant.LB;
            }else{
                return Quadrant.LT;
            }
        }
    }
    private calcAngle(pointer:{x:number;y:number}){
        const offsetY = pointer.y - this._startPoint.y;
        const offsetX = pointer.x - this._startPoint.x;
        if(0===offsetY&&0===offsetX){
            return 0;
        }
        const angle = Math.atan(offsetY/offsetX)/Math.PI * 180;// 可能返回NaN 即0/0  没有移动，不做处理
        const quadrant = this.calcQuadrant(pointer);
        switch (quadrant){
            case Quadrant.RT:
                return 360 + angle;
            case Quadrant.LB:
                return 180 + angle;
            case Quadrant.LT:
                return 180 + angle;
            case Quadrant.RB:
            default:
                return angle;
        }
    }
    public static calcPointsByRadius(center:{x: number; y: number},radius:number,offsetAngle:number){
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
                    return new Point(center.x + radius*cosAngle,center.y + radius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new fabric.Point(center.x - radius*cosAngle,center.y + radius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new Point(center.x - radius*cosAngle,center.y - radius*sinAngle);
                }else{
                    return new Point(center.x + radius*cosAngle,center.y - radius*sinAngle);
                }
            }else{
                // 内角
                if(_angle>0 && _angle<=90){
                    return new Point(center.x + innerRadius*cosAngle,center.y + innerRadius*sinAngle);
                }else if(_angle>90 && _angle<=180){
                    return new Point(center.x - innerRadius*cosAngle,center.y + innerRadius*sinAngle);
                }else if(_angle>180 && _angle<=270){
                    return new Point(center.x - innerRadius*cosAngle,center.y - innerRadius*sinAngle);
                }else{
                    return new Point(center.x + innerRadius*cosAngle,center.y - innerRadius*sinAngle);
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
        const radius = Math.sqrt(Math.pow(this._startPoint.x-pointer.x,2)+Math.pow(this._startPoint.y-pointer.y,2));
        const angle = this.calcAngle(pointer);
        this._points = StarBrush.calcPointsByRadius(this._startPoint,radius,angle);
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
        this.dispatchMessage(this.objectId,this._points);
    }
    protected onMouseUp() {
        this._finalizeAndAddPath();
    }
    
    private _reset() {
        this._points=[];
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
        const square = new Star(this.objectId,this._points,{
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
    protected dispatchMessage(objectId:string,points:Point[]){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            points,
            type:SHAPE_TYPE.Star,
            stroke: this.stroke,
            strokeWidth: this.width,
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {StarBrush}