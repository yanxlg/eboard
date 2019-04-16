/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import {Bind} from 'lodash-decorators';
import React from 'react';
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {EBoardTab} from './EBoardTab';
import {EBoardTool} from './EBoardTool';
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";


class EBoard extends React.PureComponent{
    componentDidMount(): void {
        document.addEventListener("contextmenu", (event)=>{
            event.preventDefault();
        });
    }
    @Bind
    private onMessageListener(message:object){
        console.log(message);
    }
    @Bind
    public dispatchMessage(){
       console.log("我将收到的消息纷发到不同的brush");
       
    }
    public render(){
        return (
            <EBoardContext onMessageListener={this.onMessageListener}>
                <ResizeEmitter/>
                <EBoardBody/>
                <EBoardTool/>
                <EBoardTab/>
            </EBoardContext>
        )
    }
}

export {EBoard}