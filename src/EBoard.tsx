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
import {IMessage} from './interface/IFrame';
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";


declare interface IEBoardProps {
    onMessageListener?:(message:object)=>void;
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
        this.props.onMessageListener&&this.props.onMessageListener(message);
    }
    @Bind
    public dispatchMessage(message:IMessage,timestamp:number){
       this.contextRef.current.dispatchMessage(message,timestamp);
    }
    public render(){
        return (
            <EBoardContext ref={this.contextRef} onMessageListener={this.onMessageListener}>
                <ResizeEmitter/>
                <EBoardBody/>
                <EBoardTool/>
                <EBoardTab/>
            </EBoardContext>
        )
    }
}

export {EBoard}