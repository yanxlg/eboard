/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:03
 * @disc:frame
 */

declare interface IFrame{
    type:"empty"|"image"|"html"|"pdf"|"images";
    id:string;
}

declare interface IImageFrame extends IFrame{
    image:string;
}