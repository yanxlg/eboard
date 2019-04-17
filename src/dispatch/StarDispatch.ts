/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/17 9:14
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/17 9:14
 * @disc:StarDispatch
 */
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {fabric} from "fabric";
import {Star} from '../derived/Star';
import {StarBrush} from '../derived/StarBrush';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class StarDispatch{
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
        let obj = this.getObject(objectId) as Star;
        const {center,radius,angle,fill,stroke,strokeWidth} = attributes;
        const start = obj?obj.radius:0;
        // TODO angle 可能也存在动画
        this._promise=this._promise.then(()=>{
            return new Promise((resolve,reject)=>{
                fabric.util.animate({
                    byValue:radius-start,
                    duration: 350,
                    endValue: radius,
                    startValue: start,
                    onChange:(value:number,valuePerc:number)=>{
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const points = StarBrush.calcPointsByRadius(center,value,angle);
                        obj=new Star(objectId,this.context,value,points,{
                            fill,
                            stroke,
                            strokeWidth,
                        });
                        this.canvas.add(obj);
                        this.canvas.requestRenderAll();
                        this.canvas.renderOnAddRemove=true;
                    },
                    onComplete:()=>{
                        resolve();
                    }
                });
            })
        });
    }
}

export {StarDispatch};