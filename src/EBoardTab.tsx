import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardTabItem} from './components/tabItem';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import './font/iconfont.css';
import {IEmptyFrame, IFrame} from './interface/IFrame';
import './style/tab.less';
import {MessageTag} from './static/MessageTag';

declare interface ITabInterface{
    showPager:boolean;
    scrollOffset:number;
    prevDisable:boolean;
    nextDisable:boolean;
}



class EBoardTab extends React.PureComponent<{}, ITabInterface>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLDivElement>=React.createRef();
    private scrollRef:RefObject<HTMLDivElement>=React.createRef();
    private addRef:RefObject<HTMLDivElement>=React.createRef();
    private prevRef:RefObject<HTMLDivElement>=React.createRef();
    private nextRef:RefObject<HTMLDivElement>=React.createRef();
    private calcItem:HTMLDivElement;
    constructor(props:{},context:IEBoardContext){
        super(props);
        this.state={showPager:false,scrollOffset:0,prevDisable:true,nextDisable:true};
        context.eventEmitter.on(EventList.Resize, this.resize);
    }
    private static getElementTotalWidth(element:HTMLDivElement){
        const style = document.defaultView.getComputedStyle(element,null);
        const marginLeft = parseInt(style["margin-left"],10);
        const marginRight = parseInt(style["margin-right"],10);
        return element.offsetWidth+marginLeft+marginRight;
    }
    private calcItemWidth(tabName:string,canRemove:boolean){
        if(!this.calcItem){
            const tabItem = document.createElement("div");
            tabItem.className="tab-item tab-item-calc";
            tabItem.innerHTML='<span class="tab-item-name"></span><i class="tab-item-remove eboard-icon eboard-icon-remove"></i>';
            this.calcItem=tabItem;
            (this.containerRef.current as HTMLDivElement).appendChild(this.calcItem);
        }
        if(canRemove){
            this.calcItem.classList.add("tab-item-can-remove");
            (this.calcItem.querySelector(".tab-item-remove") as HTMLDivElement).style.display="inline-block";
        }else{
            this.calcItem.classList.remove("tab-item-can-remove");
            (this.calcItem.querySelector(".tab-item-remove") as HTMLDivElement).style.display="none";
        }
        (this.calcItem.querySelector(".tab-item-name") as HTMLDivElement).innerText=tabName;
        return EBoardTab.getElementTotalWidth(this.calcItem);
    }
    
    @Bind
    private scrollToView(element:HTMLDivElement,removeElement?:HTMLDivElement,resize?:boolean){
        if(!element){return;}
        const scroll = this.scrollRef.current;
        let {offsetLeft:elementLeft} = element;
        const {scrollOffset} = this.state;
        const width = EBoardTab.getElementTotalWidth(element);
        let {scrollWidth} = scroll;
        if(removeElement){
            const removeWidth = EBoardTab.getElementTotalWidth(removeElement);;
            if(removeElement.offsetLeft<elementLeft){
                elementLeft=elementLeft-removeWidth;
            }
            scrollWidth = scrollWidth-removeWidth;
        }
        const addBtn = this.addRef.current;
        const container = this.containerRef.current;
        const preBtn = this.prevRef.current;
        const nextBtn = this.nextRef.current;
        const nextShowPager = scrollWidth >  container.offsetWidth-addBtn.offsetWidth;
        const offsetWidth = nextShowPager? container.offsetWidth-addBtn.offsetWidth - preBtn.offsetWidth - nextBtn.offsetWidth: container.offsetWidth-addBtn.offsetWidth;
        
        if(scrollOffset+offsetWidth<elementLeft+width){
            // 右超出，右对齐
            const nextScrollOffset = elementLeft+width-offsetWidth;
            this.setState({
                scrollOffset:nextScrollOffset,
                prevDisable:nextScrollOffset<=0,
                nextDisable:nextScrollOffset+offsetWidth>=scrollWidth,
                showPager:nextShowPager
            })
        }else if(scrollOffset>elementLeft){
            // 左超出，左对齐
            this.setState({
                scrollOffset:elementLeft,
                prevDisable:elementLeft<=0,
                nextDisable:elementLeft+offsetWidth>=scrollWidth,
                showPager:nextShowPager
            })
        }else{
            // 不涉及到元素增减
            if(!removeElement&&!resize){
                return;
            }else{
                this.setState({
                    scrollOffset:Math.max(0,Math.min(scrollWidth-offsetWidth,scrollOffset)),
                    showPager:nextShowPager
                })
            }
        }
    }
    @Bind
    private scrollToLast(addFrame?:IFrame){
        const scroll = this.scrollRef.current;
        const container = this.containerRef.current;
        const addBtn = this.addRef.current;
        const prevBtn = this.prevRef.current;
        const nextBtn = this.nextRef.current;
        const addWidth = addFrame?this.calcItemWidth(addFrame.wbName,addFrame.canRemove):0;
        const {scrollWidth,offsetWidth} = scroll;
        const {showPager} = this.state;
        const nextShowPager = scrollWidth+addWidth>container.offsetWidth-addBtn.offsetWidth;
        this.setState({
            showPager:nextShowPager,
            scrollOffset:!nextShowPager?0:showPager?scrollWidth+addWidth-offsetWidth:scrollWidth+addWidth-(container.offsetWidth-addBtn.offsetWidth-prevBtn.offsetWidth-nextBtn.offsetWidth),
            nextDisable:true,
            prevDisable:!nextShowPager,
        });
    }
    
    @Bind
    private onItemRemove(wbNumber:string){
        this.remove(wbNumber);
        this.context.onMessageListener({
            tag:MessageTag.RemoveFrame,
            wbNumber
        });
    }
    @Bind
    private onItemClick(wbNumber:string,element:HTMLDivElement){
        this.scrollToView(element);
        this.context.updateActiveWbNumber(wbNumber);
        this.context.onMessageListener({
            tag:MessageTag.SwitchToFrame,
            wbNumber
        });
    }
    @Bind
    private onAddClick(){
        const {config} = this.context;
        const frame:IEmptyFrame = {
            wbType:FRAME_TYPE_ENUM.EMPTY,
            wbNumber:Date.now().toString(),
            canRemove:true,
            wbName:config.defaultName,
        };
        this.add(frame);
        this.context.onMessageListener({
            tag:MessageTag.CreateFrame,
            ...frame
        });
    }
    @Bind
    private onPrevClick(){
        // offset 80%
        const {scrollOffset} = this.state;
        let scrollWidth = (this.scrollRef.current as HTMLDivElement).offsetWidth;
        const nextOffset = Math.max(scrollOffset-scrollWidth*0.4,0);
        this.setState({
            nextDisable:false,
            prevDisable:nextOffset<=0,
            scrollOffset:nextOffset
        })
    }
    @Bind
    private onNextClick(){
        const {scrollOffset} = this.state;
        const {offsetWidth,scrollWidth} = (this.scrollRef.current as HTMLDivElement);
        const nextOffset = Math.min(Math.max(scrollOffset+offsetWidth*0.4,0),scrollWidth-offsetWidth);
        this.setState({
            nextDisable:nextOffset+offsetWidth>=scrollWidth,
            prevDisable:false,
            scrollOffset:nextOffset
        })
    }
    @Bind
    public add(tabItem:IFrame,active?:boolean){
        const {wbNumber} = tabItem;
        const {boardMap,activeBoard} = this.context;
        boardMap.set(wbNumber,tabItem);
        this.context.updateBoardMap(boardMap,active===false?activeBoard:wbNumber);
        this.scrollToLast(tabItem);
    };
    @Bind
    public remove(wbNumber:string){
        const {boardMap,activeBoard} = this.context;
        boardMap.delete(wbNumber);
        const scroll = this.scrollRef.current;
        const item = scroll.querySelector(`[data-e-id="${wbNumber}"]`) as HTMLDivElement;
        const nextActiveId = activeBoard === wbNumber ? boardMap.size>0?boardMap.last().wbNumber:undefined: activeBoard;
        this.context.updateBoardMap(boardMap,nextActiveId);
        if(nextActiveId){
            const activeItem = scroll.querySelector(`[data-e-id="${nextActiveId}"]`) as HTMLDivElement;
            this.scrollToView(activeItem,item)
        }else{
            // 无元素
            this.setState({
                showPager:false,
                prevDisable:true,
                nextDisable:true,
                scrollOffset:0
            })
        }
    }
    @Bind
    public setActive(wbNumber:string){
        const scroll = this.scrollRef.current;
        const item = scroll.querySelector(`[data-e-id="${wbNumber}"]`) as HTMLDivElement;
        this.scrollToView(item);
        this.context.updateActiveWbNumber(wbNumber);
    }
    @Bind
    public resize(){
        const scroll = this.scrollRef.current;
        const activeId = this.context.activeBoard;
        if(activeId){
            const item = scroll.querySelector(`[data-e-id="${activeId}"]`) as HTMLDivElement;
            this.scrollToView(item,undefined,true);
        }
    }
    render(){
        const {showPager,scrollOffset,prevDisable,nextDisable} = this.state;
        const {activeBoard,boardMap} = this.context;
        const boardList = boardMap.toArray();
        return (
            <div className="tab-container" ref={this.containerRef}>
                <div className={`tab-scroll ${showPager?"tab-scroll-pager":""}`} ref={this.scrollRef}>
                    <div className="tab-scroll-bar" style={{transform:`translateX(-${scrollOffset}px)`}}>
                        {
                            boardList.map((frame,index)=>(
                                <EBoardTabItem wbName={frame.wbName} canRemove={frame.canRemove} wbIcon={frame.wbIcon} wbNumber={frame.wbNumber} key={frame.wbNumber} activeNumber={activeBoard} onClick={this.onItemClick} onRemove={this.onItemRemove}/>
                            ))
                        }
                    </div>
                </div>
                <div ref={this.prevRef} className={`eboard-icon eboard-icon-left-b tab-prev ${prevDisable?"tab-prev-disable":""} ${showPager?"":"tab-prev-hide"}`} onClick={this.onPrevClick}/>
                <div ref={this.nextRef} className={`eboard-icon eboard-icon-right-b tab-next ${nextDisable?"tab-next-disable":""} ${showPager?"":"tab-next-hide"}`} onClick={this.onNextClick}/>
                <div className={`eboard-icon eboard-icon-append-b tab-add ${showPager?"tab-add-pager":""}`} ref={this.addRef} onClick={this.onAddClick}/>
            </div>
        )
    }
}


export {EBoardTab};