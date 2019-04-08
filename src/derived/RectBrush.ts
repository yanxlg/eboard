/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 14:54
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 14:54
 * @disc:RectBrush
 */
import {fabric} from 'fabric';
import {Rect} from './Rect';
import {SquareBrush} from './SquareBrush';

class RectBrush extends SquareBrush{
    private ry:number=0;
    protected calcPoints(pointer:fabric.Point){
        this.rx=Math.abs(pointer.x-this.centerPoint.x);
        this.ry=Math.abs(pointer.y-this.centerPoint.y);
    }
    protected _render() {
        let ctx  = this.canvas.contextTop;
        this._saveAndTransform(ctx);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.lineWidth=this.width;
        ctx.beginPath();
        ctx.translate( this.centerPoint.x, this.centerPoint.y );
        ctx.moveTo(-this.rx, -this.ry);
        ctx.lineTo(this.rx, -this.ry);
        ctx.lineTo(this.rx, this.ry);
        ctx.lineTo(-this.rx, this.ry);
        ctx.closePath();
        this.fill&&ctx.fill();
        this.stroke&&ctx.stroke();
        ctx.restore();
    }
    protected _finalizeAndAddPath(){
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const width = this.rx*2;
        const height = this.ry*2;
        const rect = new Rect(this.objectId,{
            left:this.centerPoint.x,
            top:this.centerPoint.y,
            originX: 'center',
            originY: 'center',
            fill:this.fill,
            stroke:this.stroke,
            strokeDashArray:this.strokeDashArray,
            strokeWidth:this.width,
            width,
            height,
        });
        this.canvas.add(rect);
        this.canvas.fire('path:created', { path: rect });
        fabric.util.requestAnimFrame(()=>{
            this.canvas.renderAll();
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
            this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        });
    }
}

export {RectBrush};