/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 15:33
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 15:33
 * @disc:TextboxBrush
 */
import {IEvent} from 'fabric/fabric-impl';
import {Bind} from 'lodash-decorators';
import {TOOL_TYPE} from '../Config';
import {EventList} from '../EBoardContext';
import {MessageTag} from '../enums/MessageTag';
import {IBrushContext} from '../interface/IBrush';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {Point} from './Point';
import {IText} from './IText';
import {fabric} from "fabric";

class ITextBrush{
    public cursorType=Cursor.text;
    public canvas:Canvas;
    private readonly context:IBrushContext;
    public fontSize:number;
    public fontColor:string;
    private instance:IText;
    private objectId:string;
    public static fontFamily:string='Microsoft YaHei,"Times New Roman"';
    private wbNumber:string;
    private pageNum?:number;
    private padding:number=10;
    constructor(canvas:Canvas,context:IBrushContext,wbNumber:string,pageNum?:number){
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
        this.canvas.skipTargetFind=false;// 需要支持对象捕获
        this.canvas.hoverCursor=this.cursorType;
        canvas.on("mouse:down",this.onMouseDown);
        context.eventEmitter.on(EventList.ColorChange,this.onDrawChange);
        context.eventEmitter.on(EventList.FontSizeChange,this.onDrawChange);
        document.addEventListener("mousedown",this.onExtraClick)
    }
    @Bind
    private onExtraClick(e:MouseEvent){
        if(e.target&&!this.canvas.container.contains(e.target as any)){
            const activeObject = this.canvas.getActiveObject();
            if(void 0 !== this.instance||activeObject&&(activeObject instanceof IText||activeObject.type==="i-text")){
                setTimeout(()=>{
                    this.exitEditing(this.instance||activeObject as IText);
                },300);
            }
        }
    }
    @Bind
    private onDrawChange(ev:any){
        const data = ev.data;
        const activeObject = this.canvas.getActiveObject();
        if(activeObject&&activeObject instanceof IText){
            activeObject.setSelectionStyles(data);
            activeObject.selectionStyleList.push({
                start:activeObject.selectionStart,
                end:activeObject.selectionEnd,
                ...data
            });
            
            // 发送消息
            this.context.onMessageListener({
                tag:MessageTag.Shape,
                shapeType:TOOL_TYPE.Text,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
                objectId:activeObject.objectId,
                attributes:{
                    left:activeObject.left,
                    top:activeObject.top,
                    text:activeObject.text,
                    fill:activeObject.fill,
                    fontSize:activeObject.fontSize,
                    padding:this.padding,
                    selectionStyleList:activeObject.selectionStyleList
                }
            });
            this.context.eventEmitter.trigger(EventList.ObjectAdd,{
                tag:MessageTag.Shape,
                shapeType:TOOL_TYPE.Text,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
                objectId:activeObject.objectId,
                attributes:{
                    left:activeObject.left,
                    top:activeObject.top,
                    text:activeObject.text,
                    fill:activeObject.fill,
                    fontSize:activeObject.fontSize,
                    beforeText:activeObject.text,
                    padding:this.padding,
                    selectionStyleList:activeObject.selectionStyleList
                },
            });
        }
    }
    @Bind
    public update(wbNumber:string,pageNum?:number){
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    @Bind
    private enterEditing(target:IText){
        this.canvas.setActiveObject(target);
        target.enterEditing();
        this.canvas.requestRenderAll();
    }
    @Bind
    private exitEditing(target:IText){
        if(target){
            this.canvas.renderOnAddRemove=false;
            target.isEditing&&target.exitEditing();
            if(target&&"" === target.text){
                this.canvas.remove(target);
            }
            this.instance=undefined as any;
            this.canvas.discardActiveObject();
            this.canvas.renderAll();
            this.canvas.renderOnAddRemove=true;
        }
    }
    @Bind
    private onMouseDown(e:IEvent){
        const target = e.target;
        this.canvas.getObjects().map((obj:fabric.Object)=>{
            obj.lockMovementX=true;
            obj.lockMovementY=true;
            obj.lockRotation=true;
            obj.lockScalingX=true;
            obj.lockScalingY=true;
        });
        if(target&&(target instanceof IText||target.type==="i-text")){
            this.enterEditing(target as IText);
            return;
        }
        if(void 0 !== this.instance){
            this.exitEditing(this.instance);
            return;
        }
        
        // this.canvas.selection=true;
        const _p = this.canvas.getPointer(e.e);
        const pointer=new Point(_p.x,_p.y);
        this.objectId=this.context.idGenerator.getId();
        this.instance = new IText(this.objectId,this.context,'',{
            left:pointer.x,
            top:pointer.y-this.padding,
            fontSize:this.fontSize,
            fill:this.fontColor,
            fontFamily:ITextBrush.fontFamily,
            padding:this.padding,
            lockMovementX:true,
            lockMovementY:true,
            lockRotation:true,
            lockScalingX:true,
            lockScalingY:true,
        });
        const instance = this.instance;
        this.instance.on("changed",(e)=>{
            this.context.onMessageListener({
                tag:MessageTag.Shape,
                shapeType:TOOL_TYPE.Text,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
                objectId:this.objectId,
                attributes:{
                    left:pointer.x,
                    top:pointer.y,
                    text:instance.text,
                    fill:instance.fill,
                    fontSize:instance.fontSize,
                    padding:this.padding,
                    selectionStyleList:instance.selectionStyleList
                }
            });
        });
        
        this.instance.on("editing:exited",()=>{
            if(instance.text){
                this.context.eventEmitter.trigger(EventList.ObjectAdd,{
                    tag:MessageTag.Shape,
                    shapeType:TOOL_TYPE.Text,
                    wbNumber:this.wbNumber,
                    pageNum:this.pageNum,
                    objectId:this.objectId,
                    attributes:{
                        left:pointer.x,
                        top:pointer.y,
                        text:instance.text,
                        fill:instance.fill,
                        fontSize:instance.fontSize,
                        padding:this.padding,
                        selectionStyleList:instance.selectionStyleList
                    },
                });
            }
           // 结束编辑
            this.exitEditing(instance);
        });
        this.canvas.add(this.instance);
        this.enterEditing(this.instance);
    };
    @Bind
    public destroy(){
        this.canvas.off("mouse:down",this.onMouseDown);
        this.instance&&this.instance.exitEditing();
        this.canvas.skipTargetFind=true;// 需要关闭对象捕获
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
        this.instance=undefined;
        this.objectId=undefined;
        this.canvas.getObjects().map((obj:fabric.Object)=>{
            obj.lockMovementX=false;
            obj.lockMovementY=false;
            obj.lockRotation=false;
            obj.lockScalingX=false;
            obj.lockScalingY=false;
        });
        this.context.eventEmitter.off(EventList.ColorChange,this.onDrawChange);
        this.context.eventEmitter.off(EventList.FontSizeChange,this.onDrawChange);
    }
}

export {ITextBrush}
