/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/25 21:07
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/25 21:07
 * @disc:UndoRedo
 */
import {Bind} from 'lodash-decorators';
import {TOOL_TYPE} from '../Config';
import {Canvas} from '../derived/Canvas';
import {EventList, IEBoardContext} from '../EBoardContext';
import {MessageTag} from '../static/MessageTag';
import {fabric} from "fabric";

class UndoRedoDispatch {
    protected readonly canvas:Canvas;
    public context:IEBoardContext;
    constructor(canvas:Canvas,context:IEBoardContext) {
        this.canvas=canvas;
        this.context=context;
        
        
        this.context.eventEmitter.on(EventList.ObjectAdd, this.onObjectAdd);
        this.context.eventEmitter.on(EventList.ObjectModify, this.onObjectModified);
        // current stack
    }
    @Bind
    private onObjectAdd(ev:any){
        const data = ev.data;
        const {wbNumber,pageNum} = data;
        this.context.pushUndoStack({...data},wbNumber,pageNum);
    }
    @Bind
    private onObjectModified(ev:any){
        const data = ev.data;
        const {wbNumber,pageNum} = data;
        this.context.pushUndoStack({...data},wbNumber,pageNum);
    }
    
    
    @Bind
    public undoAction(data:any){
        const {tag,objectId,evented} = data;
        switch (tag) {
            case MessageTag.Shape:
                const {shapeType,attributes} = data;
                const instance =  this.canvas.getObjects().find((obj:any)=>{
                    return obj.objectId === objectId;
                });
                if(instance){
                    if(shapeType===TOOL_TYPE.Text){
                        instance.visible=true;
                        (instance as fabric.Textbox).text=attributes?attributes.beforeText:"";
                        (instance as fabric.Textbox).exitEditing();
                        this.canvas.requestRenderAll();
                    }else{
                        instance.visible=false;
                        this.canvas.requestRenderAll();
                    }
                }
                break;
            case MessageTag.SelectionRotate:
            case MessageTag.SelectionScale:
            case MessageTag.SelectionMove:
                const {prevState,ids} = data;
                this.canvas.getObjects().filter((obj:any)=>{
                    const index = ids.indexOf(obj.objectId);
                    if(index>-1){
                        if(prevState){
                            const _transform=prevState[obj.objectId];
                            obj.set({
                                ..._transform
                            }).setCoords();
                        }
                        return true;
                    }else{
                        return false;
                    }
                });
                this.canvas.requestRenderAll();
                break;
            case MessageTag.Clear:
            case MessageTag.Delete:
                const {ids:idList} = data;
                this.canvas.getObjects().map((object:any)=>{
                    if(idList.indexOf(object.objectId)>-1){
                        object.visible=true
                    }
                });
                this.canvas.requestRenderAll();
                break;
            default:
                break;
        }
        if(!evented){
            this.context.onMessageListener({
                action:"undo",
                ...data,
            })
        }
    }
    @Bind
    public redoAction(data:any){
        const {tag,objectId,evented} = data;
        switch (tag) {
            case MessageTag.Shape:
                const {shapeType,text} = data;
                const instance =  this.canvas.getObjects().find((obj:any)=>{
                    return obj.objectId === objectId;
                });
                if(instance){
                    if(shapeType===TOOL_TYPE.Text){
                        instance.visible=true;
                        (instance as fabric.Textbox).text=text;
                        (instance as fabric.Textbox).exitEditing();
                        this.canvas.requestRenderAll();
                    }else{
                        instance.visible=true;
                        this.canvas.requestRenderAll();
                    }
                }
                break;
            case MessageTag.SelectionRotate:
            case MessageTag.SelectionScale:
            case MessageTag.SelectionMove:
                const {transform,ids} = data;
                this.canvas.getObjects().filter((obj:any)=>{
                    const index = ids.indexOf(obj.objectId);
                    if(index>-1){
                        if(transform){
                            const _transform=transform[obj.objectId];
                            obj.set({
                                ..._transform
                            }).setCoords();
                        }
                        return true;
                    }else{
                        return false;
                    }
                });
                this.canvas.requestRenderAll();
                break;
            case MessageTag.Clear:
            case MessageTag.Delete:
                const {ids:idList} = data;
                this.canvas.getObjects().map((object:any)=>{
                    if(idList.indexOf(object.id)>-1){
                        object.visible=false;
                    }
                });
                this.canvas.requestRenderAll();
                break;
            default:
                break;
        }
        if(!evented){
            this.context.onMessageListener({
                action:"redo",
                ...data,
            })
        }
    }
}

export {UndoRedoDispatch};