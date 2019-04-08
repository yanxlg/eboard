import {fabric} from "fabric"
import {BaseBrush} from './BaseBrush';
import {IBrush} from '../interface/IBrush';
import {Circle} from "./Circle";
import {Point} from './Point';

const piBy2 = Math.PI * 2;

class CircleBrush extends BaseBrush<Circle> implements IBrush{
    protected _startPoint:Point;
    protected drawDot(pointer:Point) {
        const ctx = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        ctx.transform(1, 0, 0, 1, pointer.x, pointer.y);
        ctx.arc(0, 0, pointer.radius, 0, piBy2, false);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    };
    // @override
    protected onMouseDown(pointer:fabric.Point){
        pointer=new Point(pointer);
        this.objectId=this.idGenerator.getId();
        this._startPoint = pointer;
        this._startPoint.radius=0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(this._startPoint);
    };
    protected onMouseMove(pointer:fabric.Point){
        pointer=new Point(pointer);
        this._startPoint.radius=Math.ceil(Math.sqrt(Math.pow(pointer.x-this._startPoint.x,2) +
            Math.pow(pointer.y-this._startPoint.y,2)));
        this.canvas.clearContext(this.canvas.contextTop);
        this.drawDot(this._startPoint);
    };
    // @override
    protected onMouseUp(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const {x,y,radius} = this._startPoint;
        const circle = new Circle(this.objectId,{
            radius,
            left: x,
            top: y,
            originX: 'center',
            originY: 'center',
            fill:this.fill,
            stroke:this.stroke,
            strokeWidth:this.width
        });
        this.canvas.add(circle);
        this.canvas.fire('path:created', { path: circle });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
    };
}

export {CircleBrush}