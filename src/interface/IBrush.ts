/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 11:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 11:03
 * @disc:Brush interface
 */
import {fabric} from "fabric";
import {IConfig} from '../Config';
import {EventList} from '../EBoardContext';
import {EventEmitter} from '../untils/EventMitter';
import {IDGenerator} from '../untils/IDGenerator';

export declare interface IBrush {
    clear:()=>void;
    render:()=>void;
}

export declare interface IObject extends fabric.Object{
    objectId:string;
    sourceId:string;
}


export declare interface IBrushContext {
    idGenerator:IDGenerator;
    config:IConfig;
    eventEmitter:EventEmitter<EventList>;
    onMessageListener:(message:object)=>void;
    pushUndoStack:(action:any,wbNumber:string,pageNum?:number)=>void;
}