/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/17 9:14
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/17 9:14
 * @disc:StarDispatch
 */
import {fabric} from 'fabric';
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Star} from '../derived/Star';
import {StarBrush} from '../derived/StarBrush';
import {EBoardCanvas} from '../EBoardCanvas';
import {IBrushContext, IObject} from '../interface/IBrush';

class StarDispatch{
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
                let obj = this.getObject(objectId) as Star;
                const {center,radius,fill,stroke,strokeWidth} = attributes;
                const _radius = obj?obj.radius:0;
                const duration= Math.abs(_radius-radius);
                return new Promise((resolve,reject)=>{
                    fabric.util.animate({
                        byValue:100,
                        duration,
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
                            const nextRadius = _radius+(radius-_radius)*valuePerc;
                            const points = StarBrush.calcPointsByRadius(center,nextRadius);
                            obj=new Star(objectId,this.context,points,nextRadius,{
                                fill,
                                stroke,
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
                })
            });
        }else{
            let obj = this.getObject(objectId) as Star;
            const {center,radius,fill,stroke,strokeWidth} = attributes;
            const finalPoints = StarBrush.calcPointsByRadius(center,radius);
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            obj=new Star(objectId,this.context,finalPoints,radius,{
                fill,
                stroke,
                strokeWidth,
            });
            this.canvas.add(obj);
            this.canvas.requestRenderAll();
            this.canvas.renderOnAddRemove=true;
        }
    }
}

export {StarDispatch};