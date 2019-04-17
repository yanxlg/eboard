/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:03
 * @disc:frame
 */
import {SHAPE_TYPE, TOOL_TYPE} from '../Config';
import {FRAME_TYPE_ENUM} from "../enums/EBoardEnum";
import {MessageTag} from '../static/MessageTag';


export declare interface ITab{
    canRemove?:boolean;
    wbIcon?:string;
    wbName?:string;
}

export declare interface IBaseFrame extends ITab{
    wbType:FRAME_TYPE_ENUM;
    wbNumber:string;
}

export declare interface IEmptyFrame extends IBaseFrame{

}

export declare interface IImageFrame extends IBaseFrame{
    image:string;
    layoutMode?:"center_contain"|"top_auto";
    render:boolean;// 是否渲染
    pageNum?:number;
}


export declare interface IImagesFrame extends IBaseFrame{
    frames:Map<number,IImageFrame>;
    pageNum:number;
}


export declare interface IPdfItemFrame extends IBaseFrame{
    pageNum:number;
    layoutMode?:"center_contain"|"top_auto";
    render:boolean;// 是否渲染
}

export declare interface IPdfFrame extends IBaseFrame{
    frames:Map<number,IPdfItemFrame>;
    pageNum:number;
    filePath:string;
}

export type IFrame = IEmptyFrame|IImageFrame|IImagesFrame|IPdfFrame;



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
}