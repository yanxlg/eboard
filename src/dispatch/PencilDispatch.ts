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



class PencilDispatch  extends fabric.PencilBrush{
    private canvas:Canvas;
    private readonly context:IEBoardContext;
    private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IEBoardContext){
        super();
        this.canvas=canvas;
        this.context=context;
    }
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
        const pathData = this.convertPointsToSVGPath(nextPoints).join('');
        obj=new Pencil(objectId,nextPoints,this.context,pathData,{
            stroke,
            strokeWidth,
            fill:null,
        });
        this.canvas.add(obj);
        this.canvas.renderAll();
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