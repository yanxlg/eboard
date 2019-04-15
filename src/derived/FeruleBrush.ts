/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 9:12
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/15 9:12
 * @disc:教鞭Brush
 */
import {Bind} from 'lodash-decorators';
import {Cursor} from '../untils/Cursor';
import {Canvas} from './Canvas';
import {IEvent} from 'fabric/fabric-impl';

class FeruleBrush{
    public cursorType=Cursor.ferule;
    public canvas:Canvas;
    constructor(canvas:Canvas){
        this.canvas=canvas;
        canvas.on("mouse:move",this.onMouseMove);
    }
    @Bind
    private onMouseMove(e:IEvent){
        // TODO send message
    }
}

export {FeruleBrush}
