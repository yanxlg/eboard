/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 16:04
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 16:04
 * @disc:Config;
 */
export declare interface IConfig {
    plugins:string[];
    showTab:boolean;
    showToolbar:boolean;
    ratio:{w:number;h:number};
    dimensions:{width:number};
    borderColor:string;
    cornerColor:string,
    "cornerStrokeColor":string,
    "cornerStyle":string,
    "strokeLineCap": string,
    "transparentCorners":boolean,
    "cornerSize":number,
    "cursorSize":number,
    "borderWidth":number,
    "strokeWidth":number,
    "stroke":string,
    "fill":string,
    "fontColor":string,
    "fontSize":number,
    "compress":boolean,
    "arrowShape":string,
    "escKey":boolean,
    "ctrlKey":boolean,
    "defaultName": string
}

const config:IConfig = require("./config.json");



export {config as Config};