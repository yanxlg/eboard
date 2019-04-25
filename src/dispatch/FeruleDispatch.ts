/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/22 17:59
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/22 17:59
 * @disc:FeruleDispatch
 */
import {Bind} from 'lodash-decorators';
import {Canvas} from '../derived/Canvas';
import {Point} from '../derived/Point';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';
import {fabric} from "fabric";

// 教鞭显示在顶层

class FeruleDispatch{
    private object:fabric.Image;
    private canvas:Canvas;
    protected readonly context:IEBoardContext;
    @Bind
    public getObject(objectId:string){
        return this.canvas.getObjects().find((obj:IObject)=>obj.objectId===objectId);
    }
    constructor(canvas:Canvas,context:IEBoardContext){
        this.canvas=canvas;
        this.context=context;
    }
    @Bind
    public onDraw(pointer:Point,ratio:number){
        const size = 24*ratio;
        if(this.object){
            this.object.left=pointer.x;
            this.object.top=pointer.y;
            this.object.width=size;
            this.object.height=size;
            this.canvas.contextTop.clearRect(0,0,this.canvas.contextTop.canvas.width,this.canvas.contextTop.canvas.height);
            this.object.render(this.canvas.contextTop);
        }else{
            fabric.Image.fromURL(require("../images/ferule.png"), (img)=>{
                this.object=img;
                img.render(this.canvas.contextTop);
            },{
                left:pointer.x,
                top:pointer.y,
                width:size,
                height:size,
                originY:"center",
                originX:"center"
            });
        }
    }
}

export {FeruleDispatch};