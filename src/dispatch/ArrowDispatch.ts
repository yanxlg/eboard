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
        let obj = this.getObject(objectId) as Arrow;
        const {startPoint,endPoint,stroke,strokeWidth,arrowType,arrowOffset,theta} = attributes;
        this._promise=this._promise.then(()=>{
            return new Promise((resolve,reject)=>{
                const prevEnd = obj?obj.endPoint:startPoint;
                const start = prevEnd.x;// 按照哪个坐标进行animate ???
                const end = endPoint.x;
                fabric.util.animate({
                    byValue:end-start,
                    duration: 350,
                    endValue: end,
                    startValue: start,
                    onChange:(value:number,valuePerc:number)=>{
                        // update object
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const _endY = (endPoint.y-startPoint.y)*valuePerc+startPoint.y;
                        const _end = new Point(value,_endY);
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