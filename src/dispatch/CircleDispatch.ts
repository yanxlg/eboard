/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 18:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 18:12
 * @disc:CircleDispatch
 */
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {fabric} from "fabric";
import {Circle} from '../derived/Circle';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class CircleDispatch{
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
    @Bind
    public onDraw(objectId:string,timestamp:number,attributes:any){
        let obj = this.getObject(objectId) as Circle;
        const {radius,left,top,fill,stroke,strokeWidth} = attributes;
        const start = obj?obj.radius:0;
        const end = radius;
        this._promise=this._promise.then(()=>{
            return new Promise((resolve,reject)=>{
                fabric.util.animate({
                    byValue:end-start,
                    duration: 350,
                    endValue: end,
                    startValue: start,
                    onChange:(value:number,valuePerc:number)=>{
                        const intValue = Math.floor(value);
                        const currentRadius = obj.radius;
                        if(currentRadius!==intValue){
                            this.canvas.renderOnAddRemove=false;
                            if(obj){
                                this.canvas.remove(obj);
                            }
                            obj=new Circle(objectId,this.context,{
                                top,
                                left,
                                radius,
                                stroke,
                                fill,
                                strokeWidth,
                                originX: 'center',
                                originY: 'center',
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

export {CircleDispatch};