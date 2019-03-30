/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import React from "react";
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";
import "./untils/polyfill";


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
                <div>
                    tab
                </div>
            </EBoardContext>
        ];
    }
}

export {EBoard}