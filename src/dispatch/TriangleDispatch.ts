/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/21 14:52
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/21 14:52
 * @disc:TriangleDispatcher
 */

import {fabric} from 'fabric';
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Point} from '../derived/Point';
import {Triangle} from '../derived/Triangle';
import {IBrushContext, IObject} from '../interface/IBrush';

class TriangleDispatch{
    private canvas:Canvas;
    private readonly context:IBrushContext;
    private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IBrushContext){
        this.canvas=canvas;
        this.context=context;
    }
    @Bind
    public onDraw(objectId:string,timestamp:number,attributes:any,animation:boolean){
        if(animation){
            this._promise=this._promise.then(()=>{
                let obj = this.getObject(objectId) as Triangle;
                const {startPoint,endPoint,stroke,strokeWidth,fill} = attributes;
                const beforeEnd = obj?obj.end:startPoint;
                // calc最大值
                const widthOffset = Math.abs(endPoint.x-beforeEnd.x);
                const heightOffset = Math.abs(endPoint.y-beforeEnd.y);
                const byWidth = widthOffset>heightOffset;
                const duration = byWidth ? widthOffset : heightOffset;
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
        }else{
            let obj = this.getObject(objectId) as Triangle;
            const {startPoint,endPoint,stroke,strokeWidth,fill} = attributes;
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            const offsetX = endPoint.x-startPoint.x;
            const offsetY = endPoint.y-startPoint.y;
            const width=Math.abs(offsetX);
            const height=Math.abs(offsetY);
            obj = new Triangle(objectId,this.context,startPoint,endPoint,{
                left: Math.min(startPoint.x,endPoint.x),
                top: Math.min(startPoint.y,endPoint.y),
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
        }
    }
}

export {TriangleDispatch};