/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 18:25
 * 支持图片布局，center align vertical; contain %
 */
import React, {RefObject} from 'react';
import {EBoardCanvas} from '../EBoardCanvas';
import {IImageFrame} from '../interface/IFrame';
import "../style/frames.less";
import PerfectScrollbar from "kxt-web/lib/perfectscrollbar";

declare interface IImageFrameProps extends IImageFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
}

class ImageFrame extends React.PureComponent<IImageFrameProps>{
    private scrollRef:RefObject<PerfectScrollbar>=React.createRef();
    componentDidUpdate(
        prevProps: Readonly<IImageFrameProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
            this.scrollRef.current.update();
    }
    render(){
        const {active,width,height,dimensions} = this.props;
        return (
            <PerfectScrollbar ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                <EBoardCanvas property={this.props} dimensions={dimensions} height={height} width={width}/>
            </PerfectScrollbar>
        )
    }
}

export {ImageFrame}