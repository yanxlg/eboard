/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:03
 * @disc:frame
 */
import {FRAME_TYPE_ENUM} from "../enums/EBoardEnum";

export declare interface IBaseFrame{
    type:FRAME_TYPE_ENUM;
    id:string;
}

export declare interface IEmptyFrame extends IBaseFrame{

}

export declare interface IImageFrame extends IBaseFrame{
    image:string;
    imageWidth:number;
    imageHeight:number;
}