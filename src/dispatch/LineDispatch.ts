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
        let obj = this.getObject(objectId) as Line;
        const {startPoint,endPoint,stroke,strokeWidth} = attributes;
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
                        obj=new Line(objectId,this.context,[start.x,start.y,value,_endY],{
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