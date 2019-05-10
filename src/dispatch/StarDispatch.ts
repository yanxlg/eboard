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
import {Point} from '../derived/Point';
import {Star} from '../derived/Star';
import {StarBrush} from '../derived/StarBrush';
import {IBrushContext, IObject} from '../interface/IBrush';

class StarDispatch{
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
                let obj = this.getObject(objectId) as Star;
                const {center,radius,angle,fill,stroke,strokeWidth} = attributes;
                const start = obj?obj.radius:0;
                const _angle = obj?obj.calcAngle:0;
                const offset = radius-start;
                const duration = Math.max(offset,angle-_angle);
                // finalPoints
                const beforePoints = obj?obj.points:new Array(10).fill(center);
                const finalPoints = StarBrush.calcPointsByRadius(center,radius,angle);
                return new Promise((resolve,reject)=>{
                    fabric.util.animate({
                        byValue:100,
                        duration,
                        endValue: 100,
                        startValue: 0,
                        onChange:(value:number,valuePerc:number)=>{
                            const points = finalPoints.map((point,index)=>{
                                const _before = beforePoints[index];
                                const {x,y} = _before;
                                return new Point((point.x-x)*valuePerc+x,(point.y-y)*valuePerc+y);
                            });
                            this.canvas.renderOnAddRemove=false;
                            if(obj){
                                this.canvas.remove(obj);
                            }
                            // const points = StarBrush.calcPointsByRadius(center,value,angle);
                            obj=new Star(objectId,this.context,value,angle,points,{
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
                    });
                })
            });
        }else{
            let obj = this.getObject(objectId) as Star;
            const {center,radius,angle,fill,stroke,strokeWidth} = attributes;
            const finalPoints = StarBrush.calcPointsByRadius(center,radius,angle);
            this.canvas.renderOnAddRemove=false;
            if(obj){
                this.canvas.remove(obj);
            }
            obj=new Star(objectId,this.context,radius,angle,finalPoints,{
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