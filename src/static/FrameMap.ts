/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/14 9:06
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/14 9:06
 * @disc:Frame 管理
 */
import {MixFrame} from '../frames/MixFrame';


class FrameMap {
    private static frameMap:Map<string,MixFrame>=new Map<string, MixFrame>();
    private static getKey(wbNumber:string,pageNum?:number){
        return JSON.stringify({
            wbNumber,
            pageNum,
        });
    }
    public static add(frame:MixFrame,wbNumber:string,pageNum?:number){
        this.frameMap.set(this.getKey(wbNumber,pageNum),frame);
    }
    public static get(wbNumber:string,pageNum?:number){
        this.frameMap.get(this.getKey(wbNumber,pageNum));
    }
    public static remove(wbNumber:string,pageNum?:number){
        this.frameMap.delete(this.getKey(wbNumber,pageNum));
    }
}

export {FrameMap};