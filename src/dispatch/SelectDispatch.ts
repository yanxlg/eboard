/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/26 13:59
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/26 13:59
 * @disc:SelectDispatch
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class SelectDispatch{
    private canvas:Canvas;
    protected readonly context:IEBoardContext;
    // private _promise:Promise<any>=new Promise<any>((resolve)=>resolve());
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IEBoardContext){
        this.canvas=canvas;
        this.context=context;
    }
    @Bind
    public onDraw(attributes:any,animation:boolean){
        if(void 0 === attributes){
            return;
        }
        this.canvas.renderOnAddRemove=false;
        this.canvas.getObjects().filter((obj:any)=>{
            const objProperty = attributes[obj.objectId];
            if(objProperty){
                obj.set({
                    ...objProperty
                }).setCoords();
                return true;
            }else{
                return false;
            }
        });
        this.canvas.requestRenderAll();
        this.canvas.renderOnAddRemove=true;
    }
}

export {SelectDispatch};