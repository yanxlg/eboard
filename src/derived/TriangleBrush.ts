/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/21 14:28
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/21 14:28
 * @disc:TriangleBrush
 */
import {fabric} from 'fabric';
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {BaseBrush} from './BaseBrush';
import {Point} from './Point';
import {Triangle} from './Triangle';

class TriangleBrush extends BaseBrush<Triangle>{
    protected _startPointer:Point;
    protected _endPointer:Point;
    
    protected onMouseDown(pointer:fabric.Point) {
        pointer=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        this._prepareForDrawing(pointer);
        this._render();
        this.dispatchMessage(this.objectId,this._startPointer,this._endPointer);
    }
    
    protected onMouseMove(pointer:fabric.Point) {
        pointer=new Point(pointer);
        this._startPointer=this._startPointer||pointer;
        this._endPointer=pointer;
        this.canvas.clearContext(this.canvas.contextTop);
        this._render();
        this.dispatchMessage(this.objectId,this._startPointer,this._endPointer);
    }
    
    protected onMouseUp() {
        this._finalizeAndAddPath();
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Triangle,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                fill:this.fill,
                stroke: this.stroke,
                strokeWidth: this.width,
                startPoint:this._startPointer,
                endPoint:this._endPointer||this._startPointer,
            }
        });
    }
    
    private _prepareForDrawing(pointer:Point) {
        this._reset();
        this._startPointer=pointer;
        this._endPointer=pointer;
    }
    
    private _reset() {
        this._startPointer=undefined;
        this._endPointer=undefined;
        this._setBrushStyles();
        const color = new fabric.Color(this.stroke);
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
        ctx.moveTo((this._startPointer.x+this._endPointer.x)/2,this._startPointer.y);
        ctx.lineTo(this._endPointer.x, this._endPointer.y);
        ctx.lineTo(this._startPointer.x, this._endPointer.y);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    }
    protected _finalizeAndAddPath(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const offsetX = this._endPointer.x-this._startPointer.x;
        const offsetY = this._endPointer.y-this._startPointer.y;
        const width=Math.abs(offsetX);
        const height=Math.abs(offsetY);
        const triangle = new Triangle(this.objectId,this.context,this._startPointer,this._endPointer,{
            left: Math.min(this._startPointer.x,this._endPointer.x),
            top: Math.min(this._startPointer.y,this._endPointer.y),
            fill:this.fill,
            stroke:this.stroke,
            strokeDashArray:this.strokeDashArray,
            strokeWidth:this.width,
            flipX:offsetX<0,
            flipY:offsetY<0,
            width,
            height,
        });
        this.canvas.add(triangle);
        this.canvas.fire('path:created', { path: triangle });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
    }
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,start:Point,end:Point){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Triangle,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                fill:this.fill,
                stroke: this.stroke,
                strokeWidth: this.width,
                startPoint:start,
                endPoint:end,
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {TriangleBrush};