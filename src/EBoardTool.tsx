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
import {
    IImageFrame,
    IImagesFrame,
    IPdfFrame,
    IPdfItemFrame,
} from './interface/IFrame';

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
        const images:string[]=[require("./frames/1.jpg"),
            require("./frames/2.jpg"),
            require("./frames/3.jpg"),
            require("./frames/4.jpg"),
            require("./frames/5.jpg")];
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
    @Bind
    private addPdfGroup(){
        const {boardMap} = this.context;
        const wbNumber = Date.now().toString();
        const frames = new Map<number,IPdfItemFrame>();
        frames.set(1,{
            type:FRAME_TYPE_ENUM.PDFTASK,
            pageNo:1,
            render:true,
            layoutMode:"top_auto",
            wbNumber:wbNumber+".1",
        });
        // pdf loading
        const frame:IPdfFrame={
            type:FRAME_TYPE_ENUM.PDF,
            wbNumber,
            tab:{
                name:"Pdf"
            },
            frames,
            pageNo:1,
            filePath:"https://res2dev.9itest.com/resource2/1000/document/20190404/d6e7818316644e7c82191d298a0c5345.pdf"
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
                <button onClick={this.addPdfGroup}>显示pdf</button>
            </div>
        )
    }
}

export {EBoardTool};