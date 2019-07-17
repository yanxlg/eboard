import {fabric} from "fabric"
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {Common} from '../untils/Common';
import {BaseBrush} from './BaseBrush';
import {IBrush} from '../interface/IBrush';
import {Circle} from "./Circle";
import {Point} from './Point';

class CircleBrush extends BaseBrush<Circle> implements IBrush{
    protected _circleData:Point;
    protected drawDot(pointer:Point) {
        const ctx = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        ctx.transform(1, 0, 0, 1, pointer.cx, pointer.cy);
        ctx.arc(0, 0, pointer.radius, 0, Common.piBy2, false);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    };
    // @override
    protected onMouseDown(pointer:fabric.Point){
        pointer=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        this._circleData = pointer;
        this._circleData.radius=0;
        this.canvas.clearContext(this.canvas.contextTop);
        this._setShadow();
        this.drawDot(this._circleData);
    };
    protected onMouseMove(pointer:fabric.Point){
        // pointer 相等就pass
        pointer=new Point(pointer);
        const offsetX = pointer.x-this._circleData.x;
        const offsetY = pointer.y-this._circleData.y;
        const absOffsetX = Math.abs(offsetX);
        const absOffsetY = Math.abs(offsetY);
        const radius = Math.min(absOffsetX,absOffsetY)/2;
        this._circleData.cx=this._circleData.x+radius*(offsetX>0?1:-1);
        this._circleData.cy=this._circleData.y+radius*(offsetY>0?1:-1);
        this._circleData.radius=radius;
        this.canvas.clearContext(this.canvas.contextTop);
        this.drawDot(this._circleData);
        this.dispatchMessage(this.objectId,this._circleData);
    };
    // @override
    protected onMouseUp(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const {cx,cy,radius} = this._circleData;
        const circle = new Circle(this.objectId,this.context,{
            radius,
            left: cx,
            top: cy,
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
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Circle,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                radius,
                left: cx,
                top: cy,
                fill:this.fill,
                stroke:this.stroke,
                strokeWidth:this.width,
            }
        });
    };
    
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,center:Point){
        const {cx,cy,radius} = center;
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Circle,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                radius,
                left: cx,
                top: cy,
                fill:this.fill,
                stroke:this.stroke,
                strokeWidth:this.width,
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {CircleBrush}