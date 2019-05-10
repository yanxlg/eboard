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
import {MessageTag} from '../enums/MessageTag';

declare interface IFrameProps{
    canRemove?:boolean;
    wbIcon?:string;
    wbName?:string;
    wbType:FRAME_TYPE_ENUM;
    wbNumber:string;
    image?:string;
    images?:string[];
    layoutMode?:"center_contain"|"top_auto";
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

class BasicFrame extends React.PureComponent<IFrameProps>{
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
            this.destroy();
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            container.addEventListener("ps-scroll-end",this.scrollEndListener);
            this.context.eventEmitter.on(EventList.Scroll, this.scrollListener);
        }
    }
    componentDidMount(): void {
        this.attachListener();
    }
    componentDidUpdate(
        prevProps: Readonly<IFrameProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
        if(this.props.wbNumber!==prevProps.wbNumber||this.props.pageNum!==prevProps.pageNum){
            this.attachListener();
        }
    }
    componentWillUnmount(): void {
        this.destroy();
    }
    @Bind
    private onPageChange(pageNum:number){
        const {wbNumber,images} = this.props;
        if(this.context.hasBoard(wbNumber,pageNum)){
            this.context.updateActiveWbNumber(wbNumber,pageNum);
        }else{
            this.context.addBoard({
                wbType:FRAME_TYPE_ENUM.IMAGES,
                wbNumber,
                layoutMode:"top_auto",
                pageNum,
                images,
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
    @Bind
    private onContainerSizeChange(){
        const {vScrollOffset=0} = this.props;
        if(this.scrollRef.current){
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            const top = vScrollOffset*container.scrollHeight;
            this.scrollRef.current.scrollTop(top,false);
        }
    }
    render(){
        const {active,width,height,dimensions,wbType,pageNum,images} = this.props;
        const {disabled,allowDocControl,eventEmitter,config,onMessageListener,idGenerator,clearUndoRedo,dispatchMessage,pushUndoStack,setCacheData} = this.context;
        const scrollDisabled=allowDocControl?false:disabled;
        
        if(wbType===FRAME_TYPE_ENUM.EMPTY){
            return [
                <div key="content" className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} onContainerSizeChange={this.onContainerSizeChange} property={this.props} width={width} height={height} dimensions={dimensions} disabled={disabled} eventEmitter={eventEmitter} config={config} onMessageListener={onMessageListener} idGenerator={idGenerator} clearUndoRedo={clearUndoRedo} dispatchMessage={dispatchMessage} pushUndoStack={pushUndoStack} setCacheData={setCacheData}/>
                </div>,
            ]
        }else{
            // disabled 表示是主讲还是非主讲，主讲可操作，需要显示touch不可用，非主讲不可操作，支持touch
            const handlers:any = disabled?['click-rail','drag-thumb','keyboard','wheel','touch']:['click-rail','drag-thumb','keyboard','wheel'];
            return [
                <PerfectScrollbar handlers={handlers} key="content" ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}} disabled={scrollDisabled}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} onContainerSizeChange={this.onContainerSizeChange} property={this.props} height={height} width={width} dimensions={dimensions} disabled={disabled} eventEmitter={eventEmitter} config={config} onMessageListener={onMessageListener} idGenerator={idGenerator} clearUndoRedo={clearUndoRedo} dispatchMessage={dispatchMessage} pushUndoStack={pushUndoStack} setCacheData={setCacheData}/>
                </PerfectScrollbar>,
                (wbType===FRAME_TYPE_ENUM.IMAGES||wbType===FRAME_TYPE_ENUM.PDF)&&images.length>1?<Pagination key="pagination" disabled={scrollDisabled} current={pageNum} total={images.length} onChange={this.onPageChange}/>:null
            ]
        }
    }
}

export {BasicFrame}