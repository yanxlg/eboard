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
import {MessageTag} from '../static/MessageTag';
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
            ctx.ellipse(pointer.x,pointer.y,pointer.rx,pointer.ry,0,0,Common.piBy2,false);
        }else{
            ctx.transform(1, 0, 0, pointer.ry / pointer.rx, pointer.x, pointer.y);
            ctx.arc(0, 0 , pointer.rx, 0, Common.piBy2, false);
        }
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    };
    protected onMouseMove(pointer:fabric.Point){
        this._startPoint.rx=~~ (0.5 + Math.abs(pointer.x-this._startPoint.x));
        this._startPoint.ry=~~ (0.5 + Math.abs(pointer.y-this._startPoint.y));
        this.canvas.clearContext(this.canvas.contextTop);
        this.drawDot(this._startPoint);
        this.dispatchMessage(this.objectId,this._startPoint);
    };
    protected onMouseUp(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const {x,y,rx,ry} = this._startPoint;
        const ellipse = new Ellipse(this.objectId,this.context,{
            left: x,
            top: y,
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
    };  @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    private dispatchMessage(objectId:string,center:Point){
        const {x,y,radius} = center;
        const message = {
            objectId,
            tag:MessageTag.Shape,
            shapeType:SHAPE_TYPE.Ellipse,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                radius,
                left: x,
                top: y,
                fill:this.fill,
                stroke:this.stroke,
                strokeWidth:this.width,
                rx:center.rx,
                ry:center.ry
            }
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {EllipseBrush};