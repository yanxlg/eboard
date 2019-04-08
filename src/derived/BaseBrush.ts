/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 16:36
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 16:36
 * @disc:BaseBrush
 */
import {fabric} from "fabric";
import {IConfig} from '../Config';
import {IDGenerator} from '../untils/IDGenerator';
import {Canvas} from './Canvas';

export declare interface IBaseBrush{
    clear:()=>void;
    render:()=>void;
    objectMap:Map<string,fabric.Object>;
    hasObjectId:(objectId:string)=>boolean;
    getObject:(objectId:string)=>fabric.Object;
    cursorType:string;
}

class BaseBrush<InstanceType extends fabric.Object> extends fabric.BaseBrush implements IBaseBrush{
    protected canvas:Canvas;
    public objectMap=new Map<string,InstanceType>();
    protected objectId?:string;
    protected _setBrushStyles:()=>void;
    protected _saveAndTransform:(ctx:CanvasRenderingContext2D)=>void;
    protected needsFullRender:boolean;
    protected _setShadow:()=>void;
    protected _resetShadow:()=>void;
    protected config:IConfig;
    protected idGenerator:IDGenerator;
    public fill?:string;
    public stroke?:string;
    public cursorType:string;
    constructor(canvas:Canvas,config:IConfig,idGenerator:IDGenerator){
        super();
        this.canvas=canvas;
        this.config=config;
        this.idGenerator=idGenerator;
    }
    public hasObjectId(objectId:string){
        return this.objectMap.has(objectId);
    }
    public getObject(objectId:string){
        return this.objectMap.get(objectId);
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