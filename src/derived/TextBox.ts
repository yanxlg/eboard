/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 15:25
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 15:25
 * @disc:Textbox
 */
import {fabric} from "fabric";
import {ITextboxOptions} from 'fabric/fabric-impl';
import {IEBoardContext} from '../EBoardContext';
import {Common} from '../untils/Common';

class TextBox extends fabric.Textbox{
    public objectId:string;
    constructor(objectId:string,context:IEBoardContext,text: string, options?: ITextboxOptions){
        super(text,Common.filterParams(options,context));
        this.objectId=objectId;
    }
}

export {TextBox}
