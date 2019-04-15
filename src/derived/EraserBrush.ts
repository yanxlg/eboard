/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/14 10:45
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/14 10:45
 * @disc:Eraser 橡皮擦
 */
import {Bind} from 'lodash-decorators';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {IEvent} from 'fabric/fabric-impl';

class EraserBrush{
    public cursorType=Cursor.cross;
    public canvas:Canvas;
    constructor(canvas:Canvas){
        this.canvas=canvas;
        canvas.skipTargetFind=false;
        canvas.on("mouse:over",this.onSelected);
        canvas.on("mouse:out",this.onUnSelected);
        canvas.on("mouse:down",this.onClick);
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
        const target = e.target;
        if(void 0 !== target && null !== target){
            target.visible=false;
            this.canvas.discardActiveObject();
            this.canvas.requestRenderAll();
        }
    }
    public destroy(){
        this.canvas.skipTargetFind=true;
        this.canvas.on("mouse:over",this.onSelected);
        this.canvas.on("mouse:out",this.onUnSelected);
        this.canvas.on("mouse:down",this.onClick);
    }
}

export {EraserBrush}
