/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 17:04
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 17:04
 * @disc:ArrowDispatch
 */

import {Bind} from 'lodash-decorators';
import {Arrow} from '../derived/Arrow';
import {ArrowBrush} from '../derived/ArrowBrush';
import {Canvas} from '../derived/Canvas';
import {fabric} from "fabric";
import {Point} from '../derived/Point';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class ArrowDispatch{
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
        this._promise=this._promise.then(()=>{
            let obj = this.getObject(objectId) as Arrow;
            const {startPoint,endPoint,stroke,strokeWidth,arrowType,arrowOffset,theta} = attributes;
            return new Promise((resolve,reject)=>{
                const prevEnd = obj?obj.endPoint:startPoint;
                fabric.util.animate({
                    byValue:100,
                    duration: 350,
                    endValue: 100,
                    startValue: 0,
                    onChange:(value:number,valuePerc:number)=>{
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const _endX = (endPoint.x-prevEnd.x)*value/100+prevEnd.x;
                        const _endY = (endPoint.y-prevEnd.y)*value/100+prevEnd.y;
                        const _end = new Point(_endX,_endY);
                        const path = ArrowBrush.convertPointsToSVGPath(arrowType,startPoint,_end,strokeWidth,arrowOffset,theta);
                        obj=new Arrow(objectId,this.context,startPoint,_end,path,{
                            stroke,
                            fill:stroke,
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

export {ArrowDispatch};