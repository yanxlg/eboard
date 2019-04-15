/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/14 9:06
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/14 9:06
 * @disc:Frame 管理
 */
import {EmptyFrame} from '../frames/EmptyFrame';
import {ImageFrame} from '../frames/ImageFrame';
import {ImagesFrame} from '../frames/ImagesFrame';
import {PdfFrame} from '../frames/PdfFrame';
import {PdfItemFrame} from '../frames/PdfItemFrame';

declare interface IFrameComponent{
    frame:ImagesFrame|PdfFrame|EmptyFrame|ImageFrame|PdfItemFrame;
    childFrames?:Map<number,EmptyFrame|ImageFrame|PdfItemFrame>
}


class FrameMap {
    public static frameMap:Map<string,IFrameComponent>=new Map<string, IFrameComponent>();
    private static setParent(wbNumber:string,frame:ImagesFrame|PdfFrame|EmptyFrame|ImageFrame|PdfItemFrame){
        this.frameMap.set(wbNumber,{
            frame,
        });
    }
    private static setChildren(wbNumber:string,pageNo:number,frame:EmptyFrame|ImageFrame|PdfItemFrame){
        const parent = this.frameMap.get(wbNumber);
        const childFrames = parent.childFrames||new Map<number, EmptyFrame|ImageFrame|PdfItemFrame>();
        childFrames.set(pageNo,frame);
        parent.childFrames=childFrames;
    }
    public static setChild(wbNumber:string,pageNo:number|undefined,frame:ImagesFrame|PdfFrame|EmptyFrame|ImageFrame|PdfItemFrame){
        if(void 0 === pageNo){
            this.setParent(wbNumber,frame);
        }else{
            this.setChildren(wbNumber,pageNo,frame as any);
        }
    }
    public static removeChild(wbNumber:string,pageNo?:number){
        if(void 0 === pageNo){
            this.frameMap.delete(wbNumber);
        }else{
            const parent = this.frameMap.get(wbNumber);
            if(void 0 !== parent){
                parent.childFrames.delete(pageNo);
            }
        }
    }
}

export {FrameMap};