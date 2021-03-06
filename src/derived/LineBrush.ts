/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 10:00
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 10:00
 * @disc:Line Brush   support Dot Line
 */

import {fabric} from 'fabric';
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {Cursor} from '../untils/Cursor';
import {BaseBrush} from './BaseBrush';
import {Line} from './Line';
import {Point} from './Point';

class LineBrush extends BaseBrush<Line>{
    protected _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    protected _startPointer:Point;
    protected _endPointer:Point;
    public cursorType=Cursor.hand;
    public set dashed(dashed:boolean){
        this.strokeDashArray=dashed?[10,4]:undefined;
    }
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
    }
    
    private _prepareForDrawing(pointer:Point) {
        this._reset();
        this._startPointer=pointer;
        this.canvas.contextTop.moveTo(pointer.x, pointer.y);
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
        let ctx  = this.canvas.contextTop,
            p1 = this._startPointer,
            p2 = this._endPointer||this._startPointer;
        const oldFillColor = ctx.fillStyle;
        ctx.fillStyle=ctx.strokeStyle;
        ctx.strokeStyle = this.stroke;
        this._saveAndTransform(ctx);
        ctx.beginPath();
        ctx.lineWidth=this.width;
        if (p1 && p2 && p1.x === p2.x && p1.y === p2.y) {
            const width = this.width / 1000;
            p1.x -= width;
            p2.x += width;
        }
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle=oldFillColor;
    }
    
    protected convertPointsToSVGPath(){
        let path = [], width = this.width / 1000,
            p1 = this._startPointer,
            p2 = this._endPointer||this._startPointer,
            multSignX = 1, multSignY = 1;
        path.push('M ', p1.x - multSignX * width, ' ', p1.y - multSignY * width, ' ');
        path.push('L ', p2.x + multSignX * width, ' ', p2.y + multSignY * width);
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
        const path = this.createPath();
        this.canvas.clearContext(this.canvas.contextTop);
        this.canvas.add(path);
        this.canvas.renderAll();
        path.setCoords();
        this._resetShadow();
        this.canvas.fire('path:created', { path});
        //undoRedo
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Line,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                startPoint:this._startPointer,
                endPoint:this._endPointer||this._startPointer,
                stroke: this.stroke,
                strokeWidth: this.width
            },
        });
    }

    public createPath():any {
        const start = this._startPointer;
        const end = this._endPointer||this._startPointer;
        const points = [start.x,start.y,end.x,end.y];
        const path = new Line(this.objectId,this.context,points, {
            fill: null,
            stroke: this.stroke,
            strokeWidth: this.width,
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
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,start:Point,end:Point){
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Line,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                startPoint:start,
                endPoint:end||start,
                stroke: this.stroke,
                strokeWidth: this.width
            },
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {LineBrush}