/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 18:25
 * 支持图片布局，center align vertical; contain %
 */
import React from "react";
import {EBoardCanvas} from '../EBoardCanvas';
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import {IImageFrame} from "../interface/IFrame";
import "../style/frames.less";


class ImageFrame extends React.PureComponent<IImageFrame>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    render(){
        const {activeBoard} = this.context;
        return (
            <EBoardCanvas className={`board-frame ${activeBoard===this.props.wbNumber?"board-frame-active":""}`} frameProperty={this.props}/>
        )
    }
}

export {ImageFrame}