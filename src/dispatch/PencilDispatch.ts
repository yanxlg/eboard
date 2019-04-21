/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 11:36
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 11:36
 * @disc:PencilDispatch
 */
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Pencil} from '../derived/Pencil';
import {fabric} from "fabric";
import {Point} from '../derived/Point';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';



class PencilDispatch{
    private canvas:Canvas;
    private readonly context:IEBoardContext;
    private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IEBoardContext){
        this.canvas=canvas;
        this.context=context;
    }
    private convertPointsToSVGPath(points:Point[],strokeWidth:number) {
        let path = [], i, width = strokeWidth / 1000,
            p1 = new fabric.Point(points[0].x, points[0].y),
            p2 = new fabric.Point(points[1].x, points[1].y),
            len = points.length, multSignX = 1, multSignY = 1, manyPoints = len > 2;
        
        if (manyPoints) {
            multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
            multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
        }
        path.push('M ', p1.x - multSignX * width, ' ', p1.y - multSignY * width, ' ');
        for (i = 1; i < len; i++) {
            if (!p1.eq(p2)) {
                let midPoint = p1.midPointFrom(p2);
                // p1 is our bezier control point
                // midpoint is our endpoint
                // start point is p(i-1) value.
                path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
            }
            p1 = points[i];
            if ((i + 1) < points.length) {
                p2 = points[i + 1];
            }
        }
        if (manyPoints) {
            multSignX = p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
            multSignY = p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
        }
        path.push('L ', p1.x + multSignX * width, ' ', p1.y + multSignY * width);
        return path;
    };
    @Bind
    private renderPoint(objectId:string,obj:Pencil,points:any,stroke:string,strokeWidth:number,callback:()=>void){
        let before = obj?obj.points.length:1;// 最小从2开始
        const total = points.length;
        if(before===total){
            callback();
            return;
        }
        const nextPoints = points.slice(0,++before).map((point:any)=>{
            return new Point(point.x,point.y);
        });
        this.canvas.renderOnAddRemove=false;
        if(obj){
            this.canvas.remove(obj);
        }
        const pathData = this.convertPointsToSVGPath(nextPoints,strokeWidth).join('');
        obj=new Pencil(objectId,nextPoints,this.context,pathData,{
            stroke,
            strokeWidth,
            fill:null,
        });
        this.canvas.add(obj);
        this.canvas.requestRenderAll();
        this.canvas.renderOnAddRemove=true;
        if(before===total){
            callback();
            return;
        }
        fabric.util.requestAnimFrame(()=>{
            this.renderPoint(objectId,obj,points,stroke,strokeWidth,callback);
        });
    }
    @Bind
    public onDraw(objectId:string,timestamp:number,attributes:any){
        this._promise=this._promise.then(()=>{
            let obj = this.getObject(objectId) as Pencil;
            const {points,stroke,strokeWidth} = Object.assign({},attributes);
           return new Promise((resolve,reject)=>{
               // 按照点进行绘制
               this.renderPoint(objectId,obj,points,stroke,strokeWidth,()=>{
                   resolve();
               })
           })
        });
    }
}

export {PencilDispatch};