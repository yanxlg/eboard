/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 11:03
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 11:03
 * @disc:Brush interface
 */
export declare interface ICirclePoint extends fabric.Point{
    radius?:number;
    fill?:string;
    rx?:number;
    ry?:number;
}

export declare interface IBrush {
    clear:()=>void;
    render:()=>void;
}