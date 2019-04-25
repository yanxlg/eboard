/**
 * @disc:共用Frame
 * @author:yanxinaliang
 * @time：2019/4/25 10:32
 */
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {Pagination} from '../components/pagination';
import {EBoardCanvas} from '../EBoardCanvas';
import {EBoardContext, EventList, IEBoardContext} from '../EBoardContext';
import {FRAME_TYPE_ENUM} from '../enums/EBoardEnum';
import "../style/frames.less";
import PerfectScrollbar from "kxt-web/lib/perfectscrollbar";
import {MessageTag} from '../static/MessageTag';

declare interface IFrameProps{
    canRemove?:boolean;
    wbIcon?:string;
    wbName?:string;
    wbType:FRAME_TYPE_ENUM;
    wbNumber:string;
    image?:string;
    imageArray?:string[];
    layoutMode?:"center_contain"|"top_auto";
    render:boolean;// 是否渲染
    pageNum?:number;
    width:number;
    height:number;
    cacheJSON?:any;
    vScrollOffset?:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
}

class MixFrame extends React.PureComponent<IFrameProps>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private eBoardCanvasRef:RefObject<EBoardCanvas>=React.createRef();
    private scrollRef:RefObject<PerfectScrollbar>=React.createRef();
    constructor(props:IFrameProps){
        super(props);
    }
    @Bind
    private scrollListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,vScrollOffset} = data;
        if(wbNumber===this.props.wbNumber&&pageNum===this.props.pageNum){
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            const top = vScrollOffset*container.scrollHeight;
            this.scrollRef.current.scrollTop(top,true);
            this.context.updateVScrollOffset(vScrollOffset,wbNumber,pageNum);
        }
    }
    @Bind
    private scrollEndListener(){
        // @ts-ignore
        const container = this.scrollRef.current.container as HTMLDivElement;
        const {wbNumber,pageNum} = this.props;
        // 记录状态
        const vScrollOffset = container.scrollTop/container.scrollHeight;
        this.context.onMessageListener({
            tag:MessageTag.Scroll,
            wbNumber,
            pageNum,
            vScrollOffset,
        });
        this.context.updateVScrollOffset(vScrollOffset,wbNumber,pageNum);
    }
    @Bind
    private destroy(){
        if(this.scrollRef.current){
            this.context.eventEmitter.off(EventList.Scroll, this.scrollListener);
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            container.removeEventListener("ps-scroll-end",this.scrollEndListener);
        }
    }
    @Bind
    private attachListener(){
        // this.scrollRef.current.
        if(this.scrollRef.current){
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            container.addEventListener("ps-scroll-end",this.scrollEndListener);
            this.context.eventEmitter.on(EventList.Scroll, this.scrollListener);
        }
    }
    componentDidMount(): void {
        this.attachListener();
    }
    componentWillUpdate(
        nextProps: Readonly<IFrameProps>, nextState: Readonly<{}>,
        nextContext: any): void {
        // remove old listener
        this.destroy();
    }
    componentDidUpdate(
        prevProps: Readonly<IFrameProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
        if(this.props.wbNumber!==prevProps.wbNumber||this.props.pageNum!==prevProps.pageNum){
            this.attachListener();
            // update scroll
            if(this.scrollRef.current){
                const {vScrollOffset=0} = this.props;
                // @ts-ignore
                const container = this.scrollRef.current.container as HTMLDivElement;
                const top = vScrollOffset*container.scrollHeight;
                console.log(top);
                this.scrollRef.current.scrollTop(top,false);
            }
        }
    }
    componentWillUnmount(): void {
        this.destroy();
    }
    @Bind
    private onPageChange(pageNum:number){
        const {wbNumber,imageArray} = this.props;
        if(this.context.hasBoard(wbNumber,pageNum)){
            this.context.updateActiveWbNumber(wbNumber,pageNum);
        }else{
            this.context.addBoard({
                wbType:FRAME_TYPE_ENUM.IMAGES,
                wbNumber,
                layoutMode:"top_auto",
                pageNum,
                imageArray,
                missTab:true,
            },wbNumber,pageNum);
            this.context.updateActiveWbNumber(wbNumber,pageNum);
        }
        this.context.onMessageListener({
            tag:MessageTag.TurnPage,
            wbNumber,
            pageNum
        })
    }
    render(){
        const {active,width,height,dimensions,wbType,pageNum,imageArray} = this.props;
        if(wbType===FRAME_TYPE_ENUM.EMPTY){
            return [
                <div key="content" className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} property={this.props} width={width} height={height} dimensions={dimensions}/>
                </div>,
            ]
        }else{
            return [
                <PerfectScrollbar key="content" ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} property={this.props} dimensions={dimensions} height={height} width={width}/>
                </PerfectScrollbar>,
                wbType===FRAME_TYPE_ENUM.IMAGES||wbType===FRAME_TYPE_ENUM.PDF?<Pagination key="pagination" current={pageNum} total={imageArray.length} onChange={this.onPageChange}/>:null
            ]
        }
    }
}

export {MixFrame}