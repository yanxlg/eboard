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
    public onDraw(objectId:string,timestamp:number,attributes:any){
        let obj = this.getObject(objectId) as Pencil;
        const {points,stroke,strokeWidth} = attributes;
        this._promise=this._promise.then(()=>{
           return new Promise((resolve,reject)=>{
               const start = Math.max(obj?obj.points.length:0,2);
               const end = points.length;
               fabric.util.animate({
                   byValue:end-start,
                   duration: 350,
                   endValue: end,
                   startValue: start,
                   onChange:(value:number)=>{
                       const intValue = Math.floor(value);
                       const size = obj.points.length;
                       if(size!==intValue){
                           // update object
                           this.canvas.renderOnAddRemove=false;
                           if(obj){
                               this.canvas.remove(obj);
                           }
                           const nextPoints = points.slice(0,intValue).map((point:any)=>{
                               return new Point(point.x,point.y);
                           });
                           const pathData = this.convertPointsToSVGPath(nextPoints).join('');
                           obj=new Pencil(objectId,nextPoints,this.context,pathData,{
                               stroke,
                               strokeWidth,
                               fill:null,
                           });
                           this.canvas.add(obj);
                           this.canvas.requestRenderAll();
                           this.canvas.renderOnAddRemove=true;
                       }
                   },
                   onComplete:()=>{
                       resolve();
                   }
               });
           })
        });
    }
}

export {PencilDispatch};