/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 12:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 12:25
 * @disc:SquuareBrush
 */
import {fabric} from 'fabric';
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {MessageTag} from '../static/MessageTag';
import {BaseBrush} from './BaseBrush';
import {Point} from './Point';
import {Square} from './Square';

export enum Quadrant{
    LT,
    LB,
    RT,
    RB
}

class SquareBrush extends BaseBrush<Square>{
    protected _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    protected centerPoint:Point;
    protected angle:number=0;
    protected rx:number=0;
    protected ry:number=0;
    
    protected onMouseDown(pointer:fabric.Point) {
        this.centerPoint=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        this._reset();
    }
    private calcQuadrant(point:{x:number,y:number}){
        if(point.x>=this.centerPoint.x){
            if(point.y>=this.centerPoint.y){
                return Quadrant.RB;
            }else{
                return Quadrant.RT;
            }
        }else{
            // 左侧
            if(point.y>=this.centerPoint.y){
                return Quadrant.LB;
            }else{
                return Quadrant.LT;
            }
        }
    }
    private calcAngle(pointer:{x:number;y:number}){
        const offsetY = pointer.y - this.centerPoint.y;
        const offsetX = pointer.x - this.centerPoint.x;
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
    protected calcPoints(pointer:fabric.Point){
        const xOffset = Math.pow(pointer.x-this.centerPoint.x,2);
        const yOffset = Math.pow(pointer.y-this.centerPoint.y,2);
        this.ry=this.rx=Math.sqrt(xOffset + yOffset) / Math.sqrt(2);
        this.angle = this.calcAngle(pointer) - 45;
    }
    protected onMouseMove(pointer:fabric.Point) {
        pointer=new Point(pointer);
        // points
        this.calcPoints(pointer);
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
        this.dispatchMessage(this.objectId,this.centerPoint,this.rx,this.ry,this.angle);
    }
    protected onMouseUp() {
        this._finalizeAndAddPath();
    }
    
    private _reset() {
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
        ctx.translate( this.centerPoint.x, this.centerPoint.y );
        ctx.rotate(this.angle*Math.PI/180);
        ctx.moveTo(-this.rx, -this.rx);
        ctx.lineTo(this.rx, -this.rx);
        ctx.lineTo(this.rx, this.rx);
        ctx.lineTo(-this.rx, this.rx);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.stroke();
        ctx.restore();
    }
    
    protected _finalizeAndAddPath(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const width = this.rx*2;
        const height = this.rx*2;
        const square = new Square(this.objectId,this.context,{
            left:this.centerPoint.x,
            top:this.centerPoint.y,
            originX: 'center',
            originY: 'center',
            fill:this.fill,
            stroke:this.stroke,
            strokeWidth:this.width,
            width,
            height,
            angle:this.angle,
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
    protected dispatchMessage(objectId:string,center:Point,rx:number,ry:number,angle:number){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            type:SHAPE_TYPE.Square,
            stroke: this.stroke,
            strokeWidth: this.width,
            left:center.x,
            top:center.y,
            width:rx*2,
            height:ry*2,
            angle,
            wbNumber:this.wbNumber,
            pageNo:this.pageNo
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {SquareBrush}