/**
 * 基础白板组件
 * 支持resize事件，resize API
 */
import React from "react";
import {EBoardCanvas} from '../EBoardCanvas';
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import {IEmptyFrame} from "../interface/IFrame";
import "../style/frames.less";


class EmptyFrame extends React.Component<IEmptyFrame>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    shouldComponentUpdate(
        nextProps: Readonly<IEmptyFrame>, nextState: Readonly<{}>,
        nextContext: any): boolean {
        return false;
    }
    render(){
        const {activeBoard} = this.context;
        return (
            <EBoardCanvas className={`board-frame ${activeBoard===this.props.id?"board-frame-active":""}`} frameProperty={this.props}/>
        )
    }
}

export {EmptyFrame}