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
    name:string;
    wbNumber:string;
}

export declare interface IBaseFrame extends ITab{
    type:FRAME_TYPE_ENUM;
}

export declare interface IEmptyFrame extends IBaseFrame{

}

export declare interface IImageFrame extends IBaseFrame{
    image:string;
    imageWidth:number;
    imageHeight:number;
}


export declare interface IImagesFrame extends IBaseFrame{
    children:IImageFrame[]
}

export type IFrame = IEmptyFrame|IImageFrame;

