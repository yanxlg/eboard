/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/21 14:52
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/21 14:52
 * @disc:TriangleDispatcher
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Point} from '../derived/Point';
import {Triangle} from '../derived/Triangle';
import {fabric} from "fabric";
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class TriangleDispatch{
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
            let obj = this.getObject(objectId) as Triangle;
            const {startPoint,endPoint,stroke,strokeWidth,fill} = attributes;
            const beforeEnd = obj?obj.end:startPoint;
            // calc最大值
            const widthOffset = Math.abs(endPoint.x-beforeEnd.x);
            const heightOffset = Math.abs(endPoint.y-beforeEnd.y);
            const byWidth = widthOffset>heightOffset;
            const offset = byWidth?widthOffset:heightOffset;
            const duration = offset;
            return new Promise((resolve,reject)=>{
                fabric.util.animate({
                    byValue:100,
                    duration,
                    endValue: 100,
                    startValue: 0,
                    onChange:(value:number,valuePerc:number)=>{
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const _endX = (endPoint.x-beforeEnd.x)*valuePerc+beforeEnd.x;
                        const _endY = (endPoint.y-beforeEnd.y)*valuePerc+beforeEnd.y;
                        const offsetX = _endX-startPoint.x;
                        const offsetY = _endY-startPoint.y;
                        const width=Math.abs(offsetX);
                        const height=Math.abs(offsetY);
                        obj = new Triangle(objectId,this.context,startPoint,new Point(_endX,_endY),{
                            left: Math.min(startPoint.x,_endX),
                            top: Math.min(startPoint.y,_endY),
                            fill,
                            stroke,
                            strokeWidth,
                            flipX:offsetX<0,
                            flipY:offsetY<0,
                            width,
                            height,
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

export {TriangleDispatch};