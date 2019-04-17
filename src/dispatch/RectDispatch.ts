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
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class RectDispatch{
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
        let obj = this.getObject(objectId) as Rect;
        const {width,height,left,top,fill,stroke,strokeWidth} = attributes;
        const start = obj?obj.width:0;
        const _height = obj?obj.height:0;
        this._promise=this._promise.then(()=>{
            return new Promise((resolve,reject)=>{
                fabric.util.animate({
                    byValue:width-start,
                    duration: 350,
                    endValue: width,
                    startValue: start,
                    onChange:(value:number,valuePerc:number)=>{
                        this.canvas.renderOnAddRemove=false;
                        if(obj){
                            this.canvas.remove(obj);
                        }
                        const _endHeight = (height-_height)*valuePerc+_height;
                        obj=new Rect(objectId,this.context,{
                            left,
                            top,
                            originX: 'center',
                            originY: 'center',
                            fill,
                            stroke,
                            strokeWidth,
                            width:value,
                            height:_endHeight,
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

export {RectDispatch};