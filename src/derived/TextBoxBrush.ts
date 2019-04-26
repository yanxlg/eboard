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
import {EventList, IEBoardContext} from '../EBoardContext';
import {MessageTag} from '../static/MessageTag';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {Point} from './Point';
import {TextBox} from './TextBox';

class TextBoxBrush{
    public cursorType=Cursor.text;
    public canvas:Canvas;
    private readonly context:IEBoardContext;
    public fontSize:number;
    public fontColor:string;
    private instance:TextBox;
    private _cacheBeforeText:string;
    private objectId:string;
    public static fontFamily:string='Microsoft YaHei,"Times New Roman"';
    private wbNumber:string;
    private pageNum?:number;
    constructor(canvas:Canvas,context:IEBoardContext,wbNumber:string,pageNum?:number){
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
        canvas.on("mouse:down",this.onMouseDown);
    }
    @Bind
    public update(wbNumber:string,pageNum?:number){
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    @Bind
    private onMouseDown(e:IEvent){
        if(void 0 !== this.instance){
            window.removeEventListener("mouseDown",this.onMouseUp);
            this.canvas.renderOnAddRemove=false;
            this.instance.exitEditing();
            if("" === this.instance.text){
                this.canvas.remove(this.instance);
                this.instance=undefined as any;
            }
            this.instance=undefined as any;
            this.canvas.renderAll();
            this.canvas.renderOnAddRemove=true;
            return;
        }
        window.addEventListener("mouseDown",this.onMouseUp);
        const _p = this.canvas.getPointer(e.e);
        const pointer=new Point(_p.x,_p.y);
        this.objectId=this.context.idGenerator.getId();
        this.instance = new TextBox(this.objectId,this.context,'',{
            left:pointer.x,
            top:pointer.y,
            fontSize:this.fontSize,
            fill:this.fontColor,
            fontFamily:TextBoxBrush.fontFamily,
        });
        this._cacheBeforeText="";
        this.instance.on("changed",()=>{
            this.context.onMessageListener({
                tag:MessageTag.Shape,
                shapeType:TOOL_TYPE.Text,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
                objectId:this.objectId,
                attributes:{
                    left:pointer.x,
                    top:pointer.y,
                    text:this.instance.text,
                    fill:this.fontColor,
                    fontSize:this.fontSize
                }
            });
            this.context.eventEmitter.trigger(EventList.ObjectAdd,{
                tag:MessageTag.Shape,
                shapeType:TOOL_TYPE.Text,
                wbNumber:this.wbNumber,
                pageNum:this.pageNum,
                objectId:this.objectId,
                attributes:{
                    left:pointer.x,
                    top:pointer.y,
                    text:this.instance.text,
                    fill:this.fontColor,
                    fontSize:this.fontSize,
                    beforeText:this._cacheBeforeText
                },
            });
            this._cacheBeforeText=this.instance.text||"";
        });
        this.canvas.add(this.instance);
        this.instance.enterEditing();// 进入编辑模式
    };
    @Bind
    private onMouseUp(){
        if(this.instance){
            this.canvas.renderOnAddRemove=false;
            this.instance.exitEditing();
            if("" === this.instance.text){
                this.canvas.remove(this.instance);
                this.instance=undefined;
            }
            this.instance=undefined;
            this.canvas.renderAll();
            this.canvas.renderOnAddRemove=true;
        }
        this.instance=undefined;
        this.objectId=undefined;
        window.removeEventListener("mouseDown",this.onMouseUp);
    }
    @Bind
    public destroy(){
        this.canvas.off("mouse:down",this.onMouseDown);
        window.removeEventListener("mouseDown",this.onMouseUp);
    }
}

export {TextBoxBrush}
