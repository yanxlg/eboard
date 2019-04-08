/**
 * 基础白板组件
 * 支持resize事件，resize API
 */
import React from "react";
import {EBoardCanvas} from '../EBoardCanvas';
import {IEmptyFrame} from "../interface/IFrame";
import "../style/frames.less";



declare interface IEmptyFrameProps extends IEmptyFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    }
}


class EmptyFrame extends React.PureComponent<IEmptyFrameProps>{
    render(){
        const {width,height,dimensions,active} = this.props;
        return (
            <div className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                <EBoardCanvas property={this.props} width={width} height={height} dimensions={dimensions}/>
            </div>
        )
    }
}

export {EmptyFrame}