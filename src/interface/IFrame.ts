/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:03
 * @disc:frame
 */
import {SHAPE_TYPE, TOOL_TYPE} from '../Config';
import {FRAME_TYPE_ENUM} from "../enums/EBoardEnum";
import {MessageTag} from '../enums/MessageTag';


export declare interface ITab{
    canRemove?:boolean;
    wbIcon?:string;
    wbName?:string;
}

export declare interface IBaseFrame extends ITab{
    wbType:FRAME_TYPE_ENUM;
    wbNumber:string;
    images?:string[];
    layoutMode?:"center_contain"|"top_auto";
    pageNum?:number;
    total?:number;
    cacheJSON?:string;
    cacheMessage?:string[];
    missTab?:boolean;
    vScrollOffset?:number;
}




export declare interface IMessage {
    tag:MessageTag;
    wbNumber:string;
    pageNum?:number;
    shapeType?:SHAPE_TYPE|TOOL_TYPE;
    attributes?:any;
    objectId?:number;
    objectIds?:number[];
    wbType?:FRAME_TYPE_ENUM;
    canRemove?:boolean;
    wbName?:string;
    wbIcon?:string;
    vScrollOffset?:number;
    images?:string[];
    layoutMode?:"center_contain"|"top_auto";
    action?:"undo"|"redo";
}