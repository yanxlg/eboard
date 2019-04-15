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
import {FrameMap} from '../static/FrameMap';

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
    private eBoardCanvasRef:RefObject<EBoardCanvas>=React.createRef();
    private scrollRef:RefObject<PerfectScrollbar>=React.createRef();
    constructor(props:IImageFrameProps){
        super(props);
        FrameMap.setChild(props.wbNumber,props.pageNo,this);
    }
    componentDidUpdate(
        prevProps: Readonly<IImageFrameProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
            this.scrollRef.current.update();
    }
    componentWillUnmount(): void {
        FrameMap.removeChild(this.props.wbNumber,this.props.pageNo);
    }
    render(){
        const {active,width,height,dimensions} = this.props;
        return (
            <PerfectScrollbar ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                <EBoardCanvas ref={this.eBoardCanvasRef} property={this.props} dimensions={dimensions} height={height} width={width}/>
            </PerfectScrollbar>
        )
    }
}

export {ImageFrame}