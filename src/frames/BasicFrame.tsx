/**
 * @disc:共用Frame
 * @author:yanxinaliang
 * @time：2019/4/25 10:32
 */
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {Pagination} from '../components/pagination';
import {EBoardCanvas, IEBoardCanvasContext} from '../EBoardCanvas';
import {EventList} from '../EBoardContext';
import {FRAME_TYPE_ENUM} from '../enums/EBoardEnum';
import "../style/frames.less";
import PerfectScrollbar from "kxt-web/lib/perfectscrollbar";
import {MessageTag} from '../enums/MessageTag';
import {IBaseFrame} from '../interface/IFrame';


export declare interface IFrameContext extends IEBoardCanvasContext{
    allowDocControl?:boolean;
    updateVScrollOffset:(vScrollOffset:number,webNumber:string,pageNum?:number)=>void;
    hasBoard:(wbNumber:string,pageNum?:number)=>boolean;
    updateActiveWbNumber:(wbNumber:string,pageNum?:number)=>void;
    addBoard:(frame:IBaseFrame,wbNumber:string,pageNum?:number)=>void;
}


declare interface IFrameProps extends IFrameContext{
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
            this.props.updateVScrollOffset(vScrollOffset,wbNumber,pageNum);
        }
    }
    @Bind
    private scrollEndListener(){
        // @ts-ignore
        const container = this.scrollRef.current.container as HTMLDivElement;
        const {wbNumber,pageNum} = this.props;
        // 记录状态
        const vScrollOffset = container.scrollTop/container.scrollHeight;
        this.props.onMessageListener({
            tag:MessageTag.Scroll,
            wbNumber,
            pageNum,
            vScrollOffset,
        });
        this.props.updateVScrollOffset(vScrollOffset,wbNumber,pageNum);
    }
    @Bind
    private destroy(){
        if(this.scrollRef.current){
            this.props.eventEmitter.off(EventList.Scroll, this.scrollListener);
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
            this.props.eventEmitter.on(EventList.Scroll, this.scrollListener);
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
        
        if(this.props.height!==prevProps.height){
            // @ts-ignore
            const container = this.scrollRef.current.container as HTMLDivElement;
            const _container = container.querySelector(".canvas-container") as HTMLDivElement;
            const top = Math.min(this.props.vScrollOffset*_container.scrollHeight,_container.scrollHeight-container.offsetHeight);
            this.scrollRef.current.scrollTop(top,false);
        }
    }
    componentWillUnmount(): void {
        this.destroy();
    }
    @Bind
    private onPageChange(pageNum:number){
        const {wbNumber,images} = this.props;
        if(this.props.hasBoard(wbNumber,pageNum)){
            this.props.updateActiveWbNumber(wbNumber,pageNum);
        }else{
            this.props.addBoard({
                wbType:FRAME_TYPE_ENUM.IMAGES,
                wbNumber,
                layoutMode:"top_auto",
                pageNum,
                images,
                missTab:true,
            },wbNumber,pageNum);
            this.props.updateActiveWbNumber(wbNumber,pageNum);
        }
        this.props.onMessageListener({
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
    @Bind
    private getCanvasProps(){
        const {disabled,allowDocControl,eventEmitter,config,onMessageListener,idGenerator,clearUndoRedo,dispatchMessage,pushUndoStack,setCacheData,clearCacheMessage} = this.props;
        return {
            disabled,
            allowDocControl,
            eventEmitter,
            config,
            onMessageListener,
            idGenerator,
            clearUndoRedo,
            dispatchMessage,
            pushUndoStack,
            setCacheData,
            clearCacheMessage
        }
    }
    render(){
        const {active,width,height,dimensions,wbType,pageNum,images} = this.props;
        const canvasProps = this.getCanvasProps();
        const scrollDisabled=canvasProps.allowDocControl?false:canvasProps.disabled;
        if(wbType===FRAME_TYPE_ENUM.EMPTY){
            return [
                <div key="content" className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} onContainerSizeChange={this.onContainerSizeChange} property={this.props} width={width} height={height} dimensions={dimensions} {...canvasProps}/>
                </div>,
            ]
        }else{
            // disabled 表示是主讲还是非主讲，主讲可操作，需要显示touch不可用，非主讲不可操作，支持touch
            const handlers:any = canvasProps.disabled?['click-rail','drag-thumb','keyboard','wheel','touch']:['click-rail','drag-thumb','keyboard','wheel'];
            return [
                <PerfectScrollbar autoHide={false} handlers={handlers} key="content" ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}} disabled={scrollDisabled}>
                    <EBoardCanvas ref={this.eBoardCanvasRef} onContainerSizeChange={this.onContainerSizeChange} property={this.props} height={height} width={width} dimensions={dimensions} {...canvasProps}/>
                </PerfectScrollbar>,
                (wbType===FRAME_TYPE_ENUM.IMAGES||wbType===FRAME_TYPE_ENUM.PDF)&&images.length>1?<Pagination key="pagination" disabled={scrollDisabled} current={pageNum} total={images.length} onChange={this.onPageChange}/>:null
            ]
        }
    }
}

export {BasicFrame}