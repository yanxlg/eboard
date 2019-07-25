/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 15:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 15:25
 * @disc:Textbox
 */
import {fabric} from "fabric";
import {ITextOptions} from 'fabric/fabric-impl';
import {IBrushContext} from '../interface/IBrush';
import {Common} from '../untils/Common';

class IText extends fabric.IText{
    public objectId:string;
    public selectionStyleList:any[]=[];
    constructor(objectId:string,context:IBrushContext,text: string, options?: ITextOptions){
        super(text,Common.filterParams(options,context));
        this.objectId=objectId;
    }
    // @ts-ignore
    private _calcTextareaPosition(){// fix textarea position
        // @ts-ignore
        const calcPosition = super._calcTextareaPosition();
        const maxWidth = window.innerWidth;
        const left = parseInt(calcPosition.left,10);
        calcPosition.left = Math.min(maxWidth-10,left) + "px";
        return calcPosition;
    }
}

export {IText}
