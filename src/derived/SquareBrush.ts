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
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {BaseBrush} from './BaseBrush';
import {Point} from './Point';
import {Rect} from './Rect';

export enum Quadrant{
    LT,
    LB,
    RT,
    RB
}

class SquareBrush extends BaseBrush<Rect>{
    protected _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    protected centerPoint:Point;
    protected shapeType=SHAPE_TYPE.Square;
    
    protected calcRectData(pointer:Point){
        const offsetX = pointer.x-this.centerPoint.x;
        const offsetY = pointer.y-this.centerPoint.y;
        const absOffsetX = Math.abs(offsetX);
        const absOffsetY = Math.abs(offsetY);
        const radius = Math.min(absOffsetX,absOffsetY)/2;
        this.centerPoint.cx=this.centerPoint.x+radius*(offsetX>0?1:-1);
        this.centerPoint.cy=this.centerPoint.y+radius*(offsetY>0?1:-1);
        this.centerPoint.rx=this.centerPoint.ry=radius;
    }
    
    protected onMouseDown(pointer:fabric.Point) {
        this.centerPoint=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        this._reset();
    }
    protected onMouseMove(pointer:fabric.Point) {
        pointer=new Point(pointer);
        this.calcRectData(pointer);
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
        this.dispatchMessage(this.objectId,this.centerPoint);
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
        ctx.translate( this.centerPoint.cx, this.centerPoint.cy );
        ctx.moveTo(-this.centerPoint.rx, -this.centerPoint.ry);
        ctx.lineTo(this.centerPoint.rx, -this.centerPoint.ry);
        ctx.lineTo(this.centerPoint.rx, this.centerPoint.ry);
        ctx.lineTo(-this.centerPoint.rx, this.centerPoint.ry);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    }
    
    protected _finalizeAndAddPath(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const width = this.centerPoint.rx*2;
        const height = this.centerPoint.ry*2;
        const square = new Rect(this.objectId,this.context,{
            left:this.centerPoint.cx,
            top:this.centerPoint.cy,
            originX: 'center',
            originY: 'center',
            fill:this.fill,
            stroke:this.stroke,
            strokeWidth:this.width,
            width,
            height,
        });
        this.canvas.add(square);
        this.canvas.fire('path:created', { path: square });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:this.shapeType,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                stroke: this.stroke,
                strokeWidth: this.width,
                left:this.centerPoint.cx,
                top:this.centerPoint.cy,
                width,
                height,
            }
        });
    }
    
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,center:Point){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:this.shapeType,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                stroke: this.stroke,
                strokeWidth: this.width,
                left:center.cx,
                top:center.cy,
                width:center.rx*2,
                height:center.ry*2,
                fill:this.fill
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {SquareBrush}