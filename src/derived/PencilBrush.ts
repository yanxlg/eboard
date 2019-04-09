/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 16:35
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 16:35
 * @disc:Pencil Brush
 * mouse API 不支持外部调用，外部调用需要考虑objectId匹配情况
 *
 * pointerEvent 支持，fix touch事件issue  后期考虑优化兼容方案
 */
import {fabric} from "fabric";
import {Bind} from 'lodash-decorators';
import {IConfig} from '../Config';
import {Cursor} from '../untils/Cursor';
import {IDGenerator} from '../untils/IDGenerator';
import {IBaseBrush} from './BaseBrush';
import {Canvas} from './Canvas';
import {Pencil} from './Pencil';
import {Point} from './Point';

class PencilBrush extends fabric.PencilBrush implements IBaseBrush{
    protected canvas:Canvas;
    private _render:()=>void;
    private strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    public objectMap=new Map<string,Pencil>();
    protected objectId?:string;
    protected config:IConfig;
    private idGenerator:IDGenerator;
    public cursorType=Cursor.hand;
    public hasObjectId(objectId:string){
        return this.objectMap.has(objectId);
    }
    public getObject(objectId:string){
        return this.objectMap.get(objectId);
    }
    constructor(canvas:Canvas,config:IConfig,idGenerator:IDGenerator){
        super();
        this.canvas=canvas;
        this.config=config;
        this.idGenerator=idGenerator;
    }
    public createPath(pathData:string) {
        const path = new Pencil(this.objectId,pathData, {
            fill: null,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray,
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
        this.objectId=this.idGenerator.getId();
        // @ts-ignore
        super.onMouseDown(pointer);
        // 绑定pointer事件
        document.addEventListener("pointermove",this.pointerEvent);
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
}

export {PencilBrush}