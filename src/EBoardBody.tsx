/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 17:48
 */

import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import {MixFrame} from './frames/MixFrame';
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

class EBoardBody extends React.Component<{},IEboardBodyState>{
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
    
  /*  shouldComponentUpdate(
        nextProps: Readonly<{}>, nextState: Readonly<IEboardBodyState>,
        nextContext: IEBoardContext): boolean {
        // 仅当active resize发生改变才会重新render
   /!*     const {activeBoard} = this.context;
        console.log(activeBoard!==nextContext.activeBoard);
        if(activeBoard!==nextContext.activeBoard||nextState.width!==this.state.width||nextState.height!==this.state.height){
            return true;
        }*!/
        return false;
    }*/
    render(){
        const {width,height,dimensions} = this.state;
        const board = this.context.getActiveBoard();
        // TODO 会重复render 需要解决
        // 最多显示3个
        return (
            <div className="layout-board-container cursor-default" ref={this.containerRef}>
                {
                    board&&dimensions?<MixFrame {...board} render={true} width={width} height={height} dimensions={dimensions} active={true}/>:null
                }
            
      {/*          {
                    width&&height&&boardList.map((board)=>{
                        const {wbType} = board;
                        return wbType===FRAME_TYPE_ENUM.EMPTY?
                            <EmptyFrame active={activeBoard===board.wbNumber} key={board.wbNumber} {...board} width={width} height={height} dimensions={dimensions}/>:
                            wbType===FRAME_TYPE_ENUM.IMAGE?<ImageFrame active={activeBoard===board.wbNumber} key={board.wbNumber} {...(board as IImageFrame)} dimensions={dimensions} height={height} width={width}/>:
                                wbType===FRAME_TYPE_ENUM.IMAGES?<ImagesFrame active={activeBoard===board.wbNumber} wbType={FRAME_TYPE_ENUM.IMAGES} key={board.wbNumber} {...board as IImagesFrame} dimensions={dimensions} width={width} height={height}/>:
                                    wbType===FRAME_TYPE_ENUM.PDF?<PdfFrame key={board.wbNumber} active={activeBoard===board.wbNumber} width={width} height={height} dimensions={dimensions} wbType={FRAME_TYPE_ENUM.PDF} {...board as IPdfFrame}/>:null;
                    })
                }*/}
            </div>
        )
    }
}

export {EBoardBody};