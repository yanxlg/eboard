/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/22 17:35
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/22 17:35
 * @disc:EraserDispatch
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {IBrushContext, IObject} from '../interface/IBrush';


class EraserDispatch{
    private canvas:Canvas;
    protected readonly context:IBrushContext;
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IBrushContext){
        this.canvas=canvas;
        this.context=context;
    }
    @Bind
    public onDraw(objectIds:string[]){
        objectIds.map((objectId:string)=>{
            let obj = this.getObject(objectId);
            if(obj){
                obj.visible=false;
            }
        });
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
    }
}

export {EraserDispatch};