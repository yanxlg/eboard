/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 9:48
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * * @Last Modified time: 2019/4/1 9:48
 * @disc:PencilTest
 */
import {fabric} from 'fabric';
import {PencilBrush} from '../src/derived/PencilBrush';


// @ts-ignore
const brush = new PencilBrush(this.fabricCanvas);
brush.width=3;
brush.color="red";
// @ts-ignore
this.fabricCanvas.freeDrawingBrush = brush;
brush.onMouseDown("1",new fabric.Point(0,0));
fabric.util.animate({
    byValue:100,
    duration: 1000,
    endValue: 100,
    startValue: 0,
    onChange(value:number){
        brush.onMouseMove("1",new fabric.Point(value,value));// 中心点
        // circleBrush.render();
    },
    onComplete:()=>{
        brush.onMouseUp();// 中心点
        console.log("COMPLETE");
    }
});