/**
 * @disc:Tool
 * @author:yanxinaliang
 * @time：2019/4/6 19:22
 */
import {Bind} from 'lodash-decorators';
import React, {MouseEvent} from 'react';
import {ArrowBrush} from './derived/ArrowBrush';
import {CircleBrush} from './derived/CircleBrush';
import {EllipseBrush} from './derived/EllipseBrush';
import {LineBrush} from './derived/LineBrush';
import {PencilBrush} from './derived/PencilBrush';
import {RectBrush} from './derived/RectBrush';
import {SquareBrush} from './derived/SquareBrush';
import {StarBrush} from './derived/StarBrush';
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IImageFrame, IImagesFrame} from './interface/IFrame';

class EBoardTool extends React.PureComponent{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    @Bind
    private onClick(e:MouseEvent<HTMLButtonElement>){
        const label = e.currentTarget.innerText;
        switch (label) {
            case "pencil":
                this.context.setBrush(PencilBrush);
                break;
            case "line":
                this.context.setBrush(LineBrush);
                break;
            case "arrow":
                this.context.setBrush(ArrowBrush);
                break;
            case "circle":
                this.context.setBrush(CircleBrush);
                break;
            case "ellipse":
                this.context.setBrush(EllipseBrush);
                break;
            case "rect":
                this.context.setBrush(RectBrush);
                break;
            case "square":
                this.context.setBrush(SquareBrush);
                break;
            case "star":
                this.context.setBrush(StarBrush);
                break;
        }
    }
    @Bind
    private addImagesGroup(){
        const images:string[]=["http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg",
            "http://pic1.nipic.com/2008-08-14/2008814183939909_2.jpg",
            "http://pic31.nipic.com/20130804/7487939_090818211000_2.jpg",
            "http://pic.58pic.com/58pic/13/74/78/73I58PICGfm_1024.jpg",
            "http://pic75.nipic.com/file/20150821/9448607_145742365000_2.jpg"];
        const {boardMap} = this.context;
        const wbNumber = Date.now().toString();
        const frames = new Map<number,IImageFrame>();
        images.map((image,index)=>{
            const _index = index+1;
            frames.set(_index,{
                type:FRAME_TYPE_ENUM.IMAGE,
                wbNumber:wbNumber+"."+index,
                image,
                layoutMode:"top_auto",
                render:_index===1
            });
        });
        const frame:IImagesFrame={
            type:FRAME_TYPE_ENUM.IMAGES,
            wbNumber,
            tab:{
                name:"图片组"
            },
            frames,
            pageNo:1
        };
        boardMap.set(wbNumber,frame);
        this.context.updateBoardMap(boardMap);
    }
    render(){
        return (
            <div style={{position:"absolute",zIndex:10,top:100}}>
                <button onClick={this.onClick}>pencil</button>
                <button onClick={this.onClick}>line</button>
                <button onClick={this.onClick}>arrow</button>
                <button onClick={this.onClick}>circle</button>
                <button onClick={this.onClick}>ellipse</button>
                <button onClick={this.onClick}>rect</button>
                <button onClick={this.onClick}>square</button>
                <button onClick={this.onClick}>star</button>
                <button onClick={this.addImagesGroup}>添加图片组</button>
            </div>
        )
    }
}

export {EBoardTool};