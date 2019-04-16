/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 16:36
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 16:36
 * @disc:BaseBrush
 */
import {fabric} from "fabric";
import {IEBoardContext} from '../EBoardContext';
import {Canvas} from './Canvas';

export declare interface IBaseBrush{
    clear:()=>void;
    render:()=>void;
    cursorType:string;
}

class BaseBrush<InstanceType extends fabric.Object> extends fabric.BaseBrush implements IBaseBrush{
    protected canvas:Canvas;
    protected objectId?:string;
    protected _setBrushStyles:()=>void;
    protected _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    protected needsFullRender:boolean;
    protected _setShadow:()=>void;
    protected _resetShadow:()=>void;
    protected context:IEBoardContext;
    public fill?:string;
    public stroke?:string;
    public cursorType:string;
    protected wbNumber:string;
    protected pageNum?:number;
    constructor(canvas:Canvas,context:IEBoardContext,wbNumber:string,pageNum?:number){
        super();
        this.canvas=canvas;
        this.context=context;
        this.wbNumber=wbNumber;
        this.pageNum=pageNum;
    }
    public clear(){
        const ctx  = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
    }
    public render(){
        this._render();
    }
    protected _render(){
        // @ts-ignore
        super._render();
    };
}

export {BaseBrush};