/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 10:30
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 10:30
 * @disc:Clipboard
 */
import {IObject} from '../interface/IBrush';

class Clipboard{
    private _clipboard?:IObject;
    public setClipboardObject(object:IObject){
        this._clipboard=object;
    }
    public getClipboardObject(){
        return this._clipboard;
    }
    public clearClipboard(){
        this._clipboard=undefined;
    }
}

export {Clipboard};