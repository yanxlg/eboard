/**
 * @disc:Tool
 * @author:yanxinaliang
 * @time：2019/4/6 19:22
 */
import {Bind} from 'lodash-decorators';
import React,{MouseEvent} from "react";
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
import {IImagesFrame} from './interface/IFrame';




class EboardTool extends React.PureComponent{
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
                break
            case "ellipse":
                this.context.setBrush(EllipseBrush);
                break
            case "rect":
                this.context.setBrush(RectBrush);
                break
            case "square":
                this.context.setBrush(SquareBrush);
                break
            case "star":
                this.context.setBrush(StarBrush);
                break
            case "next":
                const {boardMap,activeBoard} = this.context;
                (boardMap.get("555") as IImagesFrame).children.set(2,{
                    type:FRAME_TYPE_ENUM.IMAGE,wbNumber:"444",name:"图片",image:"http://pic.58pic.com/58pic/13/48/85/35m58PIChbY_1024.jpg",imageWidth:740,imageHeight:929,
                    layoutMode:"top_auto"
                });
                (boardMap.get("555") as IImagesFrame).pageNo=2;
                EBoardContext.updateBoardMap(boardMap,activeBoard);
                break;
        }
    
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
                <button onClick={this.onClick}>next</button>
            </div>
        )
    }
}

export {EboardTool};