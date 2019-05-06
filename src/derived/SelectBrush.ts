/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 9:29
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 9:29
 * @disc:选择
 */

import {ActiveSelection, Group, IEvent} from 'fabric/fabric-impl';
import {Bind} from 'lodash-decorators';
import {IEBoardContext} from '../EBoardContext';
import {IObject} from '../interface/IBrush';
import {MessageTag} from '../static/MessageTag';
import {Cursor} from '../untils/Cursor';
import {IDGenerator} from '../untils/IDGenerator';
import {Canvas} from './Canvas';
import {fabric} from "fabric";
import {Point} from './Point';
import {Clipboard} from "../untils/Clipboard";


class SelectBrush {
    public cursorType=Cursor.ferule;
    public canvas:Canvas;
    private context:IEBoardContext;
    private clipBoard = new Clipboard();
    private _position?:{x:number;y:number};
    private containsProperties=["borderColor","cornerColor","cornerStrokeColor","cornerStyle","transparentCorners","cornerSize","borderScaleFactor","selectable","id","sourceId"];
    private _cacheObjectsTransforms:any={};
    private idGenerator:IDGenerator;
    private wbNumber:string;
    private pageNum?:number;
    constructor(canvas:Canvas,context:IEBoardContext,wbNumber:string,pageNum?:number){
        this.canvas=canvas;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
        this.context=context;
        this.canvas.selection=true;
        this.canvas.skipTargetFind=false;
        this.idGenerator=context.idGenerator;
        this.canvas.on("selection:created",this.onSelection);
        this.canvas.on("selection:updated",this.onSelection);
        window.addEventListener("keydown",this.onKeyDown);
        this.canvas.on('mouse:move', this.onMouseMove);
        this.canvas.on('mouse:out', this.onMouseOut);
    }
    @Bind
    public update(wbNumber:string,pageNum?:number){
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    @Bind
    private onTransform(e:IEvent){
        this.canvas.discardActiveObject();
        const target:fabric.Object|ActiveSelection = e.target as fabric.Object|ActiveSelection;
        if(void 0 !== target){
            const objects = target.type==="activeSelection"?(target as ActiveSelection).getObjects():[target];
            let objectsTransform:any={};
            objects.map((object:IObject)=>{
                objectsTransform[object.objectId]={
                    flipX:object.flipX,
                    flipY:object.flipY,
                    angle:object.angle,
                    scaleX:object.scaleX,
                    scaleY:object.scaleY,
                    left:object.left,
                    top:object.top
                };
            });
            const action = e.transform["action"];
            // let data;
            switch (action){
                case "drag":
                    console.log({prevState:this._cacheObjectsTransforms});
                    this.context.onMessageListener({
                        tag:MessageTag.Transform,
                        attributes:objectsTransform,
                        wbNumber:this.wbNumber,
                        pageNum:this.pageNum,
                    });
                    // data = this.transform(ids,objectsTransform,MessageTag.SelectionMove);
                    // this.canvas.eventBus.trigger("object:modified",{...data,prevState:this._cacheObjectsTransforms});
                    break;
                case "rotate":
                    console.log({prevState:this._cacheObjectsTransforms});
                    this.context.onMessageListener({
                        tag:MessageTag.Transform,
                        attributes:objectsTransform,
                        wbNumber:this.wbNumber,
                        pageNum:this.pageNum,
                    });
                    // data = this.transform(ids,objectsTransform,MessageTag.SelectionRotate);
                    // this.canvas.eventBus.trigger("object:modified",{...data,prevState:this._cacheObjectsTransforms});
                    break;
                case "scale":
                case "scaleX":
                case "scaleY":
                    this.context.onMessageListener({
                        tag:MessageTag.Transform,
                        attributes:objectsTransform,
                        wbNumber:this.wbNumber,
                        pageNum:this.pageNum
                    });
                    console.log({prevState:this._cacheObjectsTransforms});
                    // data = this.transform(ids,objectsTransform,MessageTag.SelectionScale);
                    // this.canvas.eventBus.trigger("object:modified",{...data,prevState:this._cacheObjectsTransforms});
                    break;
                default:
                    break;
            }
        }
    }
    @Bind
    protected onMouseMove(event:IEvent){
        const _p = this.canvas.getPointer(event.e);
        const point = new Point(_p.x,_p.y);
        this._position = {
            x:point.x,
            y:point.y
        };
    }
    @Bind
    protected onMouseOut(){
        this._position=undefined;
    }
   
    @Bind
    private onSelection(event:IEvent){
        const target = event.target;
        if(void 0 !== target){
            const onTransformEnd = (e:IEvent)=>{
                target.off("scaled",this.onTransform);
                target.off("scaled",onTransformEnd);
                target.off("moved",onTransformEnd);
                target.off("moved",this.onTransform);
                target.off("rotated",onTransformEnd);
                target.off("rotated",this.onTransform);
            };
            target.on("scaled",this.onTransform);
            target.on("moved",this.onTransform);
            target.on("rotated",this.onTransform);
            target.on("moved",onTransformEnd);
            target.on("scaled",onTransformEnd);
            target.on("rotated",onTransformEnd);
            // 保存选中元素的初始化transform属性，undoRedo需要当前属性及前置属性
            let objectsTransform:any={};
            if(target.type==="activeSelection"){
                (target as ActiveSelection).clone((group:Group)=>{
                    const objects = group.getObjects();
                    group.destroy();
                    objects.map((object:IObject)=>{
                        objectsTransform[object.objectId]={
                            flipX:object.flipX,
                            flipY:object.flipY,
                            angle:object.angle,
                            scaleX:object.scaleX,
                            scaleY:object.scaleY,
                            left:object.left,
                            top:object.top
                        };
                    });
                },["objectId"]);
            }else{
                const object:IObject=target as any;
                objectsTransform[object.objectId]={
                    flipX:object.flipX,
                    flipY:object.flipY,
                    angle:object.angle,
                    scaleX:object.scaleX,
                    scaleY:object.scaleY,
                    left:object.left,
                    top:object.top
                };
            }
            this._cacheObjectsTransforms=objectsTransform;
        }
    }
    
    @Bind
    private onKeyDown(e:KeyboardEvent){
        const {ctrlKey,keyCode} = e;
        if(!ctrlKey) {return}
        switch (keyCode){
            case 67:
                this.onCopy();
                break;
            case 88:
                this.onCut();
                break;
            case 86:
                this.onPaste();
                break;
            default:
                break;
        }
    }
    @Bind
    private onCopy(){
        const activeObject = this.canvas.getActiveObject();
        if(void 0 !== activeObject){
            activeObject.clone((cloned:any)=>{
                this.clipBoard.setClipboardObject(cloned);
            },this.containsProperties);
            this.canvas.discardActiveObject();
        }
    }
    @Bind
    private onCut(){
        const activeObject = this.canvas.getActiveObject();
        if(void 0 !== activeObject){
            activeObject.clone((cloned:any)=>{
                this.clipBoard.setClipboardObject(cloned);
            },this.containsProperties);
            let ids:string[]=[];
            // ids;
            if(activeObject.type==="activeSelection"){
                const objects = (activeObject as ActiveSelection).getObjects();
                objects.map((obj:IObject)=>{
                    obj.visible=false;
                    ids.push(obj.objectId);
                });
            }else{
                activeObject.visible=false;
                ids.push((activeObject as IObject).objectId);
            }
            this.canvas.discardActiveObject();
            this.canvas.requestRenderAll();
        }
    }
    @Bind
    private onPaste(){
        const copy = this.clipBoard.getClipboardObject();
        if(void 0 !== copy){
            copy.clone((clonedObj:any)=>{
                this.canvas.renderOnAddRemove=false;
                this.canvas.discardActiveObject();
                if(this._position){
                    clonedObj.set({
                        left: this._position.x,
                        top: this._position.y,
                    });
                }else{
                    clonedObj.set({
                        left: clonedObj.left + 10,
                        top: clonedObj.top + 10,
                    });
                }
                if (clonedObj.type === 'activeSelection') {
                    clonedObj.setCoords();
                    clonedObj.destroy();
                    let objects:any[]=[];
                    clonedObj.forEachObject((obj:IObject)=>{
                        obj.sourceId = obj.objectId;
                        obj.objectId=this.idGenerator.getId();
                        this.canvas.add(obj);
                        objects.push(obj.toJSON(this.containsProperties));
                    });
                } else {
                    clonedObj.sourceId = clonedObj.id;
                    clonedObj.id=this.idGenerator.getId();
                    this.canvas.add(clonedObj);
                }
                this.canvas.requestRenderAll();
                this.canvas.renderOnAddRemove=true;
            },this.containsProperties);
        }
    }
    @Bind
    public destroy(){
        this.canvas.selection=false;
        this.canvas.skipTargetFind=true;
        this.canvas.off("selection:created",this.onSelection);
        this.canvas.off("selection:updated",this.onSelection);
        window.removeEventListener("keydown",this.onKeyDown);
        this.canvas.off('mouse:move', this.onMouseMove);
        this.canvas.off('mouse:out', this.onMouseOut);
    }
}

export {SelectBrush}