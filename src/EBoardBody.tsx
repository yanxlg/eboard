/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 17:48
 */

import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {EmptyFrame} from './frames/EmptyFrame';
import {ImageFrame} from './frames/ImageFrame';
import {ImagesFrame} from './frames/ImagesFrame';
import {PdfFrame} from './frames/PdfFrame';
import {IImageFrame, IImagesFrame} from './interface/IFrame';
import './style/cursor.less';

// 延迟初始化加载

declare interface IEboardBodyState {
    width?:number;
    height?:number;
    dimensions?:{
        width:number;
        height:number;
    }
}

class EBoardBody extends React.PureComponent<{},IEboardBodyState>{
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
    render(){
        const boardList = EBoardContext.getBoardList();
        const {activeBoard} = this.context;
        const {width,height,dimensions} = this.state;
        return (
            <div className="layout-board-container cursor-default" ref={this.containerRef}>
                {
                    width&&height&&boardList.map((board)=>{
                        const {type} = board;
                        return type===FRAME_TYPE_ENUM.EMPTY?
                            <EmptyFrame active={activeBoard===board.wbNumber} key={board.wbNumber} {...board} width={width} height={height} dimensions={dimensions}/>:
                            type===FRAME_TYPE_ENUM.IMAGE?<ImageFrame active={activeBoard===board.wbNumber} key={board.wbNumber} {...(board as IImageFrame)} dimensions={dimensions} height={height} width={width}/>:
                                type===FRAME_TYPE_ENUM.IMAGES?<ImagesFrame active={activeBoard===board.wbNumber} type={FRAME_TYPE_ENUM.IMAGES} key={board.wbNumber} {...board as IImagesFrame} dimensions={dimensions} width={width} height={height}/>:
                            type===FRAME_TYPE_ENUM.PDF?<PdfFrame key={board.wbNumber} active={activeBoard===board.wbNumber} width={width} height={height} dimensions={dimensions} pdfUrl={""} pageNo={1} type={FRAME_TYPE_ENUM.PDF} {...board as IImagesFrame}/>:null;
                    })
                }
            </div>
        )
    }
}

export {EBoardBody};