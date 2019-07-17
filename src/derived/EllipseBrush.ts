/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 23:08
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 23:08
 * @disc:EllipseBrush
 */
import {fabric} from 'fabric';
import {Bind, Debounce} from 'lodash-decorators';
import {SHAPE_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {Common} from '../untils/Common';
import {CircleBrush} from './CircleBrush';
import {Ellipse} from './Ellipse';
import {Point} from './Point';

class EllipseBrush extends CircleBrush{
    protected drawDot(pointer:Point) {
        const ctx = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        if(ctx.ellipse){
            ctx.ellipse(pointer.cx,pointer.cy,pointer.rx,pointer.ry,0,0,Common.piBy2,false);
        }else{
            ctx.transform(1, 0, 0, pointer.ry / pointer.rx, pointer.cx, pointer.cy);
            ctx.arc(0, 0 , pointer.rx, 0, Common.piBy2, false);
        }
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    };
    protected onMouseMove(pointer:fabric.Point){
        this._circleData.rx=~~ (0.5 + Math.abs(pointer.x-this._circleData.x));
        this._circleData.ry=~~ (0.5 + Math.abs(pointer.y-this._circleData.y));
        this._circleData.cx = (pointer.x+this._circleData.x)/2;
        this._circleData.cy = (pointer.y+this._circleData.y)/2;
        this.canvas.clearContext(this.canvas.contextTop);
        this.drawDot(this._circleData);
        this.dispatchMessage(this.objectId,this._circleData);
    };
    protected onMouseUp(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const {cx,cy,rx,ry} = this._circleData;
        const ellipse = new Ellipse(this.objectId,this.context,{
            left: cx,
            top: cy,
            rx,
            ry,
            originX: 'center',
            originY: 'center',
            fill:this.fill,
            stroke:this.stroke,
            strokeWidth:this.width
        });
        this.canvas.add(ellipse);
        this.canvas.fire('path:created', { path: ellipse });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
        this.context.eventEmitter.trigger(EventList.ObjectAdd,{
            objectId:this.objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Ellipse,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                left: cx,
                top: cy,
                fill:this.fill,
                stroke:this.stroke,
                strokeWidth:this.width,
                rx,
                ry
            }
        });
    };
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    protected dispatchMessage(objectId:string,center:Point){
        const {cx,cy,rx,ry} = center;
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Ellipse,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                left: cx,
                top: cy,
                fill:this.fill,
                stroke:this.stroke,
                strokeWidth:this.width,
                rx,
                ry
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {EllipseBrush};