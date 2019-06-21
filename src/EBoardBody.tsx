/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 17:48
 */

import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import {BasicFrame} from './frames/BasicFrame';
import './style/cursor.less';

// 延迟初始化加载

declare interface IEBoardBodyState {
    width?:number;
    height?:number;
    dimensions?:{
        width:number;
        height:number;
    }
}

class EBoardBody extends React.Component<{},IEBoardBodyState>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLDivElement>=React.createRef();
    constructor(props:{},context:IEBoardContext){
        super(props);
        this.state={};
        context.eventEmitter.on(EventList.Resize, this.resize);
    }
    @Bind
    private calc(){
        const container = this.containerRef.current;
        const {offsetWidth:width,offsetHeight:height} = container;
        const ratio = this.context.config.ratio;
        const ratioW=ratio.w;
        const ratioH=ratio.h;
        const ratioNum=ratioW/ratioH;
        const defaultDimensionW = this.context.config.dimensions.width;
        let w:number,h:number;
        if(width/height>ratioNum){
            w = height * ratioNum;
            h = height;
        }else{
            w = width;
            h = width / ratioNum;
        }
        return {
            dimensions:{
                height:defaultDimensionW * h/w,
                width:defaultDimensionW,
            },
            height:h,
            width:w
        };
    }
    @Bind
    private resize(){
        const size = this.calc();
        this.setState({
            ...size
        })
    }
    componentDidMount(): void {
        this.resize();
    }
    @Bind
    private getFrameProps(){
        const {allowDocControl,updateVScrollOffset,hasBoard,updateActiveWbNumber,addBoard,disabled,dispatchMessage,setCacheData,clearCacheMessage,clearUndoRedo,idGenerator,config,eventEmitter,onMessageListener,pushUndoStack} = this.context;
        return {allowDocControl,updateVScrollOffset,hasBoard,updateActiveWbNumber,addBoard,disabled,dispatchMessage,setCacheData,clearCacheMessage,clearUndoRedo,idGenerator,config,eventEmitter,onMessageListener,pushUndoStack};
    }
    render(){
        const {width,height,dimensions} = this.state;
        const board = this.context.getActiveBoard();
        const props=this.getFrameProps();
        return (
            <div className="layout-board-container cursor-default" ref={this.containerRef}>
                {
                    board&&dimensions?<BasicFrame {...board} width={width} height={height} dimensions={dimensions} active={true} {...props}/>:null
                }
            </div>
        )
    }
}

export {EBoardBody};