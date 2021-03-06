/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 16:13
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 16:13
 * @disc:TextBoxDispatch
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {IText} from '../derived/IText';
import {ITextBrush} from '../derived/ITextBrush';
import {IBrushContext, IObject} from '../interface/IBrush';


class ITextDispatch{
    private canvas:Canvas;
    private readonly context:IBrushContext;
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
        let obj = this.getObject(objectId) as IText;
        const {text,fontSize,left,top,fill,padding=0,selectionStyleList} = attributes;
        this.canvas.renderOnAddRemove=false;
        if(obj){
            this.canvas.remove(obj);
        }
        obj=new IText(objectId,this.context,text,{
            fontSize,
            left,
            fill,
            top:top-padding,
            fontFamily:ITextBrush.fontFamily,
            padding
        });
        if(selectionStyleList&&selectionStyleList.length>0){
            selectionStyleList.map((item:any)=>{
                const {start,end,...extra} = item;
                obj.setSelectionStyles(extra,start,end);
            })
        }
        this.canvas.add(obj);
        this.canvas.renderAll();
        this.canvas.renderOnAddRemove=true;
    }
}

export {ITextDispatch};