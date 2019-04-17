/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 16:35
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 16:35
 * @disc:Pencil Brush
 * mouse API 不支持外部调用，外部调用需要考虑objectId匹配情况
 * pointerEvent 支持，fix touch事件issue  后期考虑优化兼容方案
 */
import {fabric} from "fabric";
import {Bind, Debounce} from 'lodash-decorators';
import {TOOL_TYPE} from '../Config';
import {IEBoardContext} from '../EBoardContext';
import {MessageTag} from '../static/MessageTag';
import {Cursor} from '../untils/Cursor';
import {IBaseBrush} from './BaseBrush';
import {Canvas} from './Canvas';
import {Pencil} from './Pencil';
import {Point} from './Point';

class PencilBrush extends fabric.PencilBrush implements IBaseBrush{
    protected canvas:Canvas;
    private _render:()=>void;
    // private strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    protected objectId?:string;
    public cursorType=Cursor.hand;
    private _points:Point[];
    private context:IEBoardContext;
    private wbNumber:string;
    private pageNum?:number;
    constructor(canvas:Canvas,context:IEBoardContext,wbNumber:string,pageNum?:number){
        super();
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    public createPath(pathData:string) {
        const path = new Pencil(this.objectId,this._points,this.context,pathData, {
            fill:null,
            stroke: this.color,
            strokeWidth: this.width,
        });
        let position = new fabric.Point(path.left + path.width / 2, path.top + path.height / 2);
        position = path.translateToGivenOrigin(position, 'center', 'center', path.originX, path.originY);
        path.top = position.y;
        path.left = position.x;
        if (this.shadow) {
            this.shadow.affectStroke = true;
            path.setShadow(this.shadow);
        }
        return path;
    }
    protected onMouseDown(pointer:fabric.Point){
        pointer=new Point(pointer);
        this.objectId=this.context.idGenerator.getId();
        // @ts-ignore
        super.onMouseDown(pointer);
        // 绑定pointer事件
        document.addEventListener("pointermove",this.pointerEvent);
        this.dispatchMessage(this.objectId,this._points);
    };
    @Bind
    private pointerEvent(e:any){
        // !this.allowTouchScrolling && e.preventDefault && e.preventDefault();
        const pointer = this.canvas.getPointer(e);
        this._onMouseMove(new fabric.Point(pointer.x,pointer.y));
        // 执行一次
    }
    @Bind
    private _onMouseMove(pointer:fabric.Point){
        pointer=new Point(pointer);
        // @ts-ignore
        super.onMouseMove(pointer);
    }
    protected onMouseMove(pointer:fabric.Point){
        this._onMouseMove(pointer);
        // 不能内部
        document.removeEventListener("pointermove",this.pointerEvent);
        this.dispatchMessage(this.objectId,this._points);
    };
    protected onMouseUp(){
        // @ts-ignore
        super.onMouseUp();
        this.objectId=undefined;
        document.removeEventListener("pointermove",this.pointerEvent);
    };
    public clear(){
        const ctx  = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
    }
    public render(){
        this._render();
    }
    @Bind
    @Debounce(40,{maxWait:40,trailing:true})
    private dispatchMessage(objectId:string,points:Point[]){
        const message = {
            tag:MessageTag.Shape,
            shapeType:TOOL_TYPE.Pencil,
            objectId,
            wbNumber:this.wbNumber,
            pageNum:this.pageNum,
            attributes:{
                points,
                stroke: this.color,
                strokeWidth: this.width
            },
        };
        this.context.onMessageListener&&this.context.onMessageListener(message);
    }
}

export {PencilBrush}