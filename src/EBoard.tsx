/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import React from "react";
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {EBoardTab} from "./EBoardTab";
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";


class EBoard extends React.PureComponent{
    private onResize(){
        console.log("resize");
    }
    public render(){
        return [
            <ResizeEmitter key="resize" onResize={this.onResize}/>,
            <EBoardContext key={"content"}>
                <EBoardBody/>
                <div>
                    toolbar
                </div>
                <EBoardTab/>
            </EBoardContext>
        ];
    }
}

export {EBoard}