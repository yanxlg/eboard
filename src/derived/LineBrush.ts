/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 10:00
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 10:00
 * @disc:Line Brush   support Dot Line
 */

import {fabric} from 'fabric';
import {IBrush} from '../interface/IBrush';
import {Canvas} from './Canvas';
import {Line} from './Line';


class LineBrush extends fabric.PencilBrush implements IBrush{
    private canvas:Canvas;
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    private _points:fabric.Point[];
    private _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    public strokeDashArray:number[]=[10,4];// dot Line
    constructor(canvas:Canvas){
        // @ts-ignore
        super(canvas);
    }

    /**
     * @override
     * @param point
     * @private
     * 保证仅存在两个点
     */
    // @ts-ignore
    private _addPoint(point:fabric.Point) {
        if(this._points.length>1){
            this._points.splice(-1,1,point);
        }else{
            this._points.push(point);
        }
        return true;
    };
    public onMouseDown:(pointer:fabric.Point)=>void;
    public onMouseUp:()=>void;
    public onMouseMove(pointer:fabric.Point){
        this._addPoint(pointer);
        this.clear();
        this.render();
    };
    /**
     * @override
     * @param pathData
     */
    public createPath(pathData:string):any {
        const start = this._points[0];
        const end = this._points.length>1?this._points[1]:this._points[0];
        const points = [start.x,start.y,end.x,end.y];
        const path = new Line(points, {
            fill: null,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray,
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
    public clear(){
        const ctx  = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
    }
    private _render(){
        let ctx  = this.canvas.contextTop,
            p1 = this._points[0],
            p2 = this._points[1];
        this._saveAndTransform(ctx);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
    };
    public render(){
        this._render();
    }
}

export {LineBrush}