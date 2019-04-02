/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import React, {RefObject} from "react";
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {EBoardTab} from "./EBoardTab";
import {ResizeEmitter} from './ResizeEmitter';
import {Bind} from "lodash-decorators";
import "./style/layout.less";


class EBoard extends React.PureComponent{
    private tabRef:RefObject<EBoardTab> = React.createRef();
    @Bind
    private onResize(){
        console.log("resize");
        this.tabRef.current.resize();
        // eventEmitter 触发整个子组建resize
    }
    public render(){
        return [
            <ResizeEmitter key="resize" onResize={this.onResize}/>,
            <EBoardContext key={"content"}>
                <EBoardBody/>
                <div>
                    toolbar
                </div>
                <EBoardTab ref={this.tabRef}/>
            </EBoardContext>
        ];
    }
}

export {EBoard}