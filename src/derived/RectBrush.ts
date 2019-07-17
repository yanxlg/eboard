/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/6 14:54
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/6 14:54
 * @disc:RectBrush
 */
import {SHAPE_TYPE} from '../Config';
import {Point} from './Point';
import {SquareBrush} from './SquareBrush';

class RectBrush extends SquareBrush{
    protected shapeType=SHAPE_TYPE.Rect;
    protected calcRectData(pointer:Point){
        const offsetX = pointer.x-this.centerPoint.x;
        const offsetY = pointer.y-this.centerPoint.y;
        this.centerPoint.cx=(pointer.x+this.centerPoint.x)/2;
        this.centerPoint.cy=(pointer.y+this.centerPoint.y)/2;
        this.centerPoint.rx=Math.abs(offsetX)/2;
        this.centerPoint.ry=Math.abs(offsetY)/2;
    }
}

export {RectBrush};