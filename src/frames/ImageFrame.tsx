/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 18:25
 */
import React from "react";
import {EBoardCanvas} from '../EBoardCanvas';
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import "../style/frames.less";


class ImageFrame extends React.Component<IImageFrame>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    shouldComponentUpdate(
        nextProps: Readonly<IFrame>, nextState: Readonly<{}>,
        nextContext: any): boolean {
        return false;
    }
    render(){
        const {activeBoard} = this.context;
        return (
            <EBoardCanvas className={`board-frame ${activeBoard===this.props.id?"board-frame-active":""}`} bgImage={this.props.image}/>
        )
    }
}

export {ImageFrame}