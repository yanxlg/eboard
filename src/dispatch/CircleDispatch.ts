/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 18:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 18:12
 * @disc:CircleDispatch
 */
import {fabric} from 'fabric';
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Circle} from '../derived/Circle';
import {EBoardCanvas} from '../EBoardCanvas';
import {IBrushContext, IObject} from '../interface/IBrush';

class CircleDispatch{
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
                let obj = this.getObject(objectId) as Circle;
                const {radius,fill,stroke,strokeWidth,left,top} = attributes;
                console.log(JSON.stringify(obj));
                const start = obj?obj.radius:0;
                const startX = obj?obj.left:left;
                const startY = obj?obj.top:top;
                console.log(startX,startY);
                const offset = radius-start;
                const duration = offset*2;
                return new Promise((resolve,reject)=>{
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
                            this.canvas.renderOnAddRemove=false;
                            if(obj){
                                this.canvas.remove(obj);
                            }
                            obj=new Circle(objectId,this.context,{
                                top:offset*valuePerc+startY,
                                left:offset*valuePerc+startX,
                                radius:offset*valuePerc+start,
                                stroke,
                                fill,
                                strokeWidth,
                                originX: 'center',
                                originY: 'center',
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
            let obj = this.getObject(objectId) as Circle;
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            const {radius,left,top,fill,stroke,strokeWidth} = attributes;
            obj=new Circle(objectId,this.context,{
                top,
                left,
                radius,
                stroke,
                fill,
                strokeWidth,
                originX: 'center',
                originY: 'center',
            });
            this.canvas.add(obj);
            this.canvas.requestRenderAll();
            this.canvas.renderOnAddRemove=true;
        }
    }
}

export {CircleDispatch};