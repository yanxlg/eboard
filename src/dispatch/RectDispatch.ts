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
import {EBoardCanvas} from '../EBoardCanvas';
import {IBrushContext, IObject} from '../interface/IBrush';


class RectDispatch{
    private canvas:Canvas;
    private readonly context:IBrushContext;
    private eBoardCanvas:EBoardCanvas;
    private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
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
                let obj = this.getObject(objectId) as Rect;
                const {width,height,left,top,fill,stroke,strokeWidth} = attributes;
                const _width = obj?obj.width:0;
                const _height = obj?obj.height:0;
                const _left = obj?obj.left:left;
                const _top = obj?obj.top:top;
                const widthOffset = Math.abs(width-_width);
                const heightOffset = Math.abs(height-_height);
                const byWidth = widthOffset>heightOffset;
                const offset = byWidth?widthOffset:heightOffset;
                const duration = offset/5;
                return new Promise((resolve,reject)=>{
                    if(0 === offset){
                        resolve();
                        return;
                    }
                    fabric.util.animate({
                        byValue:100,
                        endValue: 100,
                        startValue: 0,
                        duration,
                        abort:()=>{
                            const {wbNumber:_wbNumber,pageNum:_pageNum} = this.eBoardCanvas.props.property;
                            return _wbNumber!==wbNumber||_pageNum!==pageNum;
                        },
                        onChange:(value:number,valuePerc:number)=>{
                            const __width = (width-_width)*valuePerc+_width;
                            const __height = (height-_height)*valuePerc+_height;
                            const __left = (left-_left)*valuePerc+_left;
                            const __top = (top-_top)*valuePerc+_top;
                            this.canvas.renderOnAddRemove=false;
                            if(obj){
                                this.canvas.remove(obj);
                            }
                            obj=new Rect(objectId,this.context,{
                                left:__left,
                                top:__top,
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
                    } as any);
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