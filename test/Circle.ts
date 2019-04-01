/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/1 9:40
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/1 9:40
 * @disc:CircleTest
 */
import {fabric} from 'fabric';
import {CircleBrush} from '../src/derived/CircleBrush';

// @ts-ignore
const circleBrush = new CircleBrush(this.fabricCanvas);
circleBrush.color="red";
circleBrush.onMouseDown(new fabric.Point(0,0));// 中心点
fabric.util.animate({
   byValue:100,
   duration: 1000,
   endValue: 100,
   startValue: 0,
   onChange(value:number){
       circleBrush.onMouseMove(new fabric.Point(value,value));// 中心点
       // circleBrush.render();
   },
   onComplete(){
       circleBrush.onMouseUp();// 中心点
       console.log("COMPLETE");
   }
});
// @ts-ignore
this.fabricCanvas.freeDrawingBrush = circleBrush;
