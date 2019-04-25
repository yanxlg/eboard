/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {EBoardTab} from './EBoardTab';
import {EBoardTool} from './EBoardTool';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IMessage} from './interface/IFrame';
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";
import {MessageTag} from './static/MessageTag';


declare interface IEBoardProps {
    onMessageListener?:(message:string)=>void;
}

class EBoard extends React.PureComponent<IEBoardProps>{
    private contextRef:RefObject<EBoardContext> = React.createRef();
    componentDidMount(): void {
        document.addEventListener("contextmenu", (event)=>{
            event.preventDefault();
        });
    }
    @Bind
    private onMessageListener(message:object){
        this.props.onMessageListener&&this.props.onMessageListener(JSON.stringify(message));
    }
    @Bind
    public dispatchMessage(message:IMessage,timestamp:number){
       this.contextRef.current.dispatchMessage(message,timestamp);
    }
    @Bind
    public addImages(){
        const images:string[]=[require("./frames/1.jpg"),
            require("./frames/2.jpg"),
            require("./frames/3.jpg"),
            require("./frames/4.jpg"),
            require("./frames/5.jpg")];
        const wbNumber = Date.now().toString();
        this.contextRef.current.addBoard({
            wbType:FRAME_TYPE_ENUM.IMAGES,
            wbNumber,
            imageArray:images,
            layoutMode:"top_auto",
            render:true,
            wbName:"图片",
            pageNum:1
        },wbNumber,1);
        this.contextRef.current.updateActiveWbNumber(wbNumber,1);
        this.onMessageListener({
            tag:MessageTag.CreateFrameGroup,
            ...{
                wbType:FRAME_TYPE_ENUM.IMAGES,
                wbNumber,
                imageArray:images,
                layoutMode:"top_auto",
                render:true,
                wbName:"图片",
                pageNum:1
            }
        });
    }
    public render(){
        return (
            <EBoardContext ref={this.contextRef} onMessageListener={this.onMessageListener}>
                <ResizeEmitter key="emitter"/>
                <EBoardBody key={"body"}/>
                <EBoardTool/>
                <EBoardTab/>
                <button onClick={this.addImages} style={{position:"absolute",top:100}}>图片组</button>
            </EBoardContext>
        )
    }
}

export {EBoard}