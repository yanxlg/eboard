/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:03
 * @disc:frame
 */
import {FRAME_TYPE_ENUM} from "../enums/EBoardEnum";


export declare interface ITab{
    canRemove?:boolean;
    icon?:string;
    name?:string;
}

export declare interface IBaseFrame{
    type:FRAME_TYPE_ENUM;
    wbNumber:string;
    tab?:ITab
}

export declare interface IEmptyFrame extends IBaseFrame{

}

export declare interface IImageFrame extends IBaseFrame{
    image:string;
    layoutMode?:"center_contain"|"top_auto";
    render:boolean;// 是否渲染
}


export declare interface IImagesFrame extends IBaseFrame{
    frames:Map<number,IImageFrame>;
    pageNo:number;
}


export declare interface IPdfItemFrame extends IBaseFrame{
    pageNo:number;
    layoutMode?:"center_contain"|"top_auto";
    render:boolean;// 是否渲染
}

export declare interface IPdfFrame extends IBaseFrame{
    frames:Map<number,IPdfItemFrame>;
    pageNo:number;
    filePath:string;
}

export type IFrame = IEmptyFrame|IImageFrame|IImagesFrame|IPdfFrame;

