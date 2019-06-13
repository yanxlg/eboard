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
    constructor(objectId:string,context:IBrushContext,text: string, options?: ITextOptions){
        super(text,Common.filterParams(options,context));
        this.objectId=objectId;
    }
}

export {IText}