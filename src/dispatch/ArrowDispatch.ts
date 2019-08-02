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
import {EBoardCanvas} from '../EBoardCanvas';
import {IBrushContext, IObject} from '../interface/IBrush';


class ArrowDispatch{
    private canvas:Canvas;
    private readonly context:IBrushContext;
    private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
    private eBoardCanvas:EBoardCanvas;
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IBrushContext,eBoardCanvas:EBoardCanvas){
        this.canvas=canvas;
        this.context=context;
        this.eBoardCanvas=eBoardCanvas;
    }
    @Bind
    public onDraw(objectId:string,timestamp:number,attributes:any,animation:boolean,wbNumber:string,pageNum?:number){
        if(animation){
            this._promise=this._promise.then(()=>{
                console.log(attributes);
                return new Promise((resolve,reject)=>{
                    let obj = this.getObject(objectId) as Arrow;
                    const {startPoint,endPoint,stroke,strokeWidth,arrowType,arrowOffset,theta} = attributes;
                    if(!endPoint){
                        resolve();
                    }else{
                        const prevEnd = obj?obj.endPoint:startPoint;
                        const changeLength = Math.sqrt(Math.pow(endPoint.x-prevEnd.x,2)+Math.pow(endPoint.y-prevEnd.y,2));
                        fabric.util.animate({
                            byValue:100,
                            duration: changeLength/5,
                            endValue: 100,
                            startValue: 0,
                            abort:()=>{
                                const {wbNumber:_wbNumber,pageNum:_pageNum} = this.eBoardCanvas.props.property;
                                return _wbNumber!==wbNumber||_pageNum!==pageNum;
                            },
                            onChange:(value:number,valuePerc:number)=>{
                                this.canvas.renderOnAddRemove=false;
                                if(obj){
                                    this.canvas.remove(obj);
                                }
                                const _endX = (endPoint.x-prevEnd.x)*valuePerc+prevEnd.x;
                                const _endY = (endPoint.y-prevEnd.y)*valuePerc+prevEnd.y;
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
                        } as any);
                    }
                })
            });
        }else{
            let obj = this.getObject(objectId) as Arrow;
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            const {arrowType,startPoint,endPoint,strokeWidth,arrowOffset,theta,stroke} = attributes;
            const path = ArrowBrush.convertPointsToSVGPath(arrowType,startPoint,endPoint,strokeWidth,arrowOffset,theta);
            obj=new Arrow(objectId,this.context,startPoint,endPoint,path,{
                stroke,
                fill:stroke,
                strokeWidth,
            });
            this.canvas.add(obj);
            this.canvas.requestRenderAll();
            this.canvas.renderOnAddRemove=true;
        }
    }
}

export {ArrowDispatch};