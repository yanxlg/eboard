/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 18:39
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 18:39
 * @disc:RectDispatch
 */
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {fabric} from "fabric";
import {Rect} from '../derived/Rect';
import {IBrushContext, IObject} from '../interface/IBrush';


class RectDispatch{
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
                let obj = this.getObject(objectId) as Rect;
                const {width,height,left,top,fill,stroke,strokeWidth} = attributes;
                const _width = obj?obj.width:0;
                const _height = obj?obj.height:0;
                const widthOffset = Math.abs(width-_width);
                const heightOffset = Math.abs(height-_height);
                const byWidth = widthOffset>heightOffset;
                const offset = byWidth?widthOffset:heightOffset;
                const duration = offset;
                return new Promise((resolve,reject)=>{
                    if(0 === offset){
                        resolve();
                        return;
                    }
                    fabric.util.animate({
                        byValue:offset,
                        duration,
                        endValue: offset,
                        startValue: byWidth?_width:_height,
                        onChange:(value:number,valuePerc:number)=>{
                            const __width = byWidth?value:(width-_width)*valuePerc+_width;
                            const __height = byWidth?(height-_height)*valuePerc+_height:value;
                            this.canvas.renderOnAddRemove=false;
                            if(obj){
                                this.canvas.remove(obj);
                            }
                            obj=new Rect(objectId,this.context,{
                                left,
                                top,
                                originX: 'center',
                                originY: 'center',
                                fill,
                                stroke,
                                strokeWidth,
                                width:__width,
                                height:__height,
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
            let obj = this.getObject(objectId) as Rect;
            const {width,height,left,top,fill,stroke,strokeWidth} = attributes;
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            obj=new Rect(objectId,this.context,{
                left,
                top,
                originX: 'center',
                originY: 'center',
                fill,
                stroke,
                strokeWidth,
                width,
                height,
            });
            this.canvas.add(obj);
            this.canvas.requestRenderAll();
            this.canvas.renderOnAddRemove=true;
        }
    }
}

export {RectDispatch};