/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 16:04
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 16:04
 * @disc:Config;
 */

export enum TOOL_TYPE {
    Select = "select",
    Pencil = "pencil",
    Text = "text",
    Eraser = "Eraser",
    Clear = "Clear",
    Undo = "Undo",
    Redo = "Redo",
    Ferule = "feruleaq",
    None="none",
    Shape="Shape",
}

export enum SHAPE_TYPE {
    Line = "line",
    Circle = "circle",
    Star = "star",
    Triangle = "Triangle",
    Rect = "rect",
    Arrow = "arrow",
    HollowCircle = "hollowCircle",
    HollowStar = "hollowStar",
    HollowTriangle = "hollowTriangle",
    HollowRect = "hollowRect",
    Square="Square",
    HollowSquare="hollowSquare",
    Ellipse="ellipse",
    HollowEllipse="hollowEllipse"
}


export declare interface IConfig {
    plugins:string[];
    showTab:boolean;
    showToolbar:boolean;
    ratio:{w:number;h:number};
    dimensions:{width:number};
    borderColor:string;
    cornerColor:string;
    "cornerStrokeColor":string;
    "cornerStyle":string;
    "strokeLineCap": string;
    "transparentCorners":boolean;
    "cornerSize":number;
    "cursorSize":number;
    "borderWidth":number;
    "strokeWidth":number;
    "stroke":string;
    "fill":string;
    "fontSize":number;
    "compress":boolean;
    "arrowShape":string;
    "escKey":boolean;
    "ctrlKey":boolean;
    "defaultName": string;
    "toolType":TOOL_TYPE;
    "pencilWidth":number;
    "shapeType":SHAPE_TYPE;
    "pickedColor":string;
}

const config:IConfig = require("./config.json");


// 读取本地配置
let _localConfig = localStorage.getItem("_eboard_config");
if(_localConfig){
    try {
        _localConfig = JSON.parse(_localConfig);
        Object.assign(config,_localConfig);
    }catch (e) {
        // TODO ERROR
    }
}


function updateConfig(config:any){
    let _config = localStorage.getItem("_eboard_config");
    if(_config){
        const __config = JSON.parse(_config);
        localStorage.setItem("_eboard_config",JSON.stringify( Object.assign({},__config,config)));
    }else{
        localStorage.setItem("_eboard_config",JSON.stringify(config));
    }
}




export {config,updateConfig};