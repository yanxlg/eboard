/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 16:26
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 16:26
 * @disc:LineDispatch
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Line} from '../derived/Line';
import {fabric} from "fabric";
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class LineDispatch{
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
            let obj = this.getObject(objectId) as Line;
            const {startPoint,endPoint,stroke,strokeWidth} = attributes;
            return new Promise((resolve,reject)=>{
                const prevEnd = obj?obj.endPoint:startPoint;
                // 根据变化点位置计算duration
                const changeLength = Math.sqrt(Math.pow(endPoint.x-prevEnd.x,2)+Math.pow(endPoint.y-prevEnd.y,2));
                fabric.util.animate({
                    byValue:100,
                    duration: changeLength,
                    endValue: 100,
                    startValue: 0,
                    onChange:(value:number,valuePerc:number)=>{
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const _endX = (endPoint.x-prevEnd.x)*valuePerc+prevEnd.x;
                        const _endY = (endPoint.y-prevEnd.y)*valuePerc+prevEnd.y;
                        obj=new Line(objectId,this.context,[startPoint.x,startPoint.y,_endX,_endY],{
                            stroke,
                            strokeWidth,
                            fill:null,
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

export {LineDispatch};