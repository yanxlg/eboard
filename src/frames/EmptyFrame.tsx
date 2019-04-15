/**
 * 基础白板组件
 * 支持resize事件，resize API
 */
import React, {RefObject} from 'react';
import {EBoardCanvas} from '../EBoardCanvas';
import {IEmptyFrame} from "../interface/IFrame";
import "../style/frames.less";
import {FrameMap} from '../static/FrameMap';



declare interface IEmptyFrameProps extends IEmptyFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
}


class EmptyFrame extends React.PureComponent<IEmptyFrameProps>{
    private eBoardCanvasRef:RefObject<EBoardCanvas>=React.createRef();
    constructor(props:IEmptyFrameProps){
        super(props);
        FrameMap.setChild(props.wbNumber,undefined,this);
    }
    componentWillUnmount(): void {
        FrameMap.removeChild(this.props.wbNumber);
    }
    public clear(){
        this.eBoardCanvasRef.current.clear();
    }
    render(){
        const {width,height,dimensions,active} = this.props;
        return (
            <div className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                <EBoardCanvas ref={this.eBoardCanvasRef} property={this.props} width={width} height={height} dimensions={dimensions}/>
            </div>
        )
    }
}

export {EmptyFrame}