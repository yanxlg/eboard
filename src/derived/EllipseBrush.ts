/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 23:08
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 23:08
 * @disc:EllipseBrush
 */
import {fabric} from 'fabric';
import {CircleBrush} from './CircleBrush';
import {Ellipse} from './Ellipse';
import {Point} from './Point';

const piBy2 = Math.PI * 2;
class EllipseBrush extends CircleBrush{
    protected drawDot(pointer:Point) {
        const ctx = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        if(ctx.ellipse){
            ctx.ellipse(pointer.x,pointer.y,pointer.rx,pointer.ry,0,0,piBy2,false);
        }else{
            ctx.transform(1, 0, 0, pointer.ry / pointer.rx, pointer.x, pointer.y);
            ctx.arc(0, 0 , pointer.rx, 0, piBy2, false);
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
    };
}

export {EllipseBrush};