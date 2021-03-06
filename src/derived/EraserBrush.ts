/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/14 10:45
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/14 10:45
 * @disc:Eraser 橡皮擦
 */
import {Bind} from 'lodash-decorators';
import {EventList} from '../EBoardContext';
import {IBrushContext, IObject} from '../interface/IBrush';
import {MessageTag} from '../enums/MessageTag';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {IEvent} from 'fabric/fabric-impl';

class EraserBrush{
    public cursorType=Cursor.erase;
    public canvas:Canvas;
    private context:IBrushContext;
    private wbNumber:string;
    private pageNum:number;
    constructor(canvas:Canvas,context:IBrushContext,wbNumber:string,pageNum?:number){
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
        canvas.skipTargetFind=false;
        canvas.on("mouse:over",this.onSelected);
        canvas.on("mouse:out",this.onUnSelected);
        canvas.on("mouse:down",this.onClick);
    }
    @Bind
    public update(wbNumber:string,pageNum?:number){
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    @Bind
    private onSelected(e:IEvent){
        const target = e.target;
        if(void 0 !== target && null !== target){
            target.hasControls=false;
            this.canvas.setActiveObject(target);
            this.canvas.renderAll();
        }
    }
    @Bind
    private onUnSelected(e:IEvent){
        const target = e.target;
        if(void 0 !== target && null !== target){
            target.hasControls=true;
            this.canvas.discardActiveObject();
            this.canvas.renderAll();
        }
    }
    @Bind
    private onClick(e:IEvent){
        const target = e.target as IObject;
        if(void 0 !== target && null !== target){
            target.visible=false;
            this.canvas.discardActiveObject();
            this.canvas.requestRenderAll();
            this.context.onMessageListener({
                tag:MessageTag.Delete,
                objectIds:[target.objectId],
                wbNumber:this.wbNumber,
                pageNum:this.pageNum
            });
            // undoRedo 需要添加
            this.context.eventEmitter.trigger(EventList.ObjectModify,{
                objectIds:[target.objectId],
                tag:MessageTag.Delete,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
            });
        }
    }
    @Bind
    public destroy(){
        this.canvas.skipTargetFind=true;
        this.canvas.off("mouse:over",this.onSelected);
        this.canvas.off("mouse:out",this.onUnSelected);
        this.canvas.off("mouse:down",this.onClick);
    }
}

export {EraserBrush}
