/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/16 16:13
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/16 16:13
 * @disc:TextBoxDispatch
 */

import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {TextBox} from '../derived/TextBox';
import {TextBoxBrush} from '../derived/TextBoxBrush';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';


class TextBoxDispatch{
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
    public onDraw(objectId:string,timestamp:number,attributes:any,animation:boolean){
        this._promise=this._promise.then(()=>{
            return new Promise((resolve,reject)=>{
                let obj = this.getObject(objectId) as TextBox;
                const {text,fontSize,left,top,fill} = attributes;
                this.canvas.renderOnAddRemove=false;
                if(obj){
                    this.canvas.remove(obj);
                }
                obj=new TextBox(objectId,this.context,text,{
                    fontSize,
                    left,
                    fill,
                    top,
                    fontFamily:TextBoxBrush.fontFamily
                });
                this.canvas.add(obj);
                this.canvas.requestRenderAll();
                this.canvas.renderOnAddRemove=true;
                resolve();
            })
        });
    }
}

export {TextBoxDispatch};