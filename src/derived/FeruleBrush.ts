/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 9:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 9:12
 * @disc:教鞭Brush
 */
import {Bind} from 'lodash-decorators';
import {IEBoardContext} from '../EBoardContext';
import {MessageTag} from '../static/MessageTag';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {IEvent} from 'fabric/fabric-impl';
import {Point} from './Point';

class FeruleBrush{
    public cursorType=Cursor.ferule;
    public canvas:Canvas;
    private context:IEBoardContext;
    private wbNumber:string;
    private pageNum?:number;
    constructor(canvas:Canvas,context:IEBoardContext,wbNumber:string,pageNum?:number){
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
        canvas.on("mouse:move",this.onMouseMove);
    }
    @Bind
    public update(wbNumber:string,pageNum?:number){
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    @Bind
    private onMouseMove(e:IEvent){
        const _p = this.canvas.getPointer(e.e);
        const pointer = new Point(_p.x,_p.y);
        this.dispatchMessage(pointer);
    }
    @Bind
    private dispatchMessage(pointer:Point){
        this.context.onMessageListener({
            tag:MessageTag.Cursor,
            attributes:pointer,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum
        });
    }
    @Bind
    public destroy(){
        this.canvas.off("mouse:move",this.onMouseMove);
    }
}

export {FeruleBrush}
