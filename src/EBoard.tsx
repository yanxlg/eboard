/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
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
    public render(){
        return (
            <EBoardContext>
                <ResizeEmitter/>
                <EBoardBody/>
                <EBoardTool/>
                <EBoardTab/>
            </EBoardContext>
        )
    }
}

export {EBoard}