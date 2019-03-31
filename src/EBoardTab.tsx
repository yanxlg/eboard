import {Bind} from "lodash-decorators";
import React, {MouseEvent, RefObject} from "react";
import {EBoardContext, IEBoardContext} from "./EBoardContext";
import {IEmptyFrame, IFrame} from "./interface/IFrame";
import "./font/iconfont.css";
import "./style/tab.less";
import {FRAME_TYPE_ENUM} from "./enums/EBoardEnum";


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
    constructor(props:{}){
        super(props);
        this.state={showPager:false,scrollOffset:0,prevDisable:true,nextDisable:true};
    }
    componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<ITabInterface>, snapshot?: any): void {
        console.log("update");
    }

    private calcItemWidth(tabName:string,canRemove:boolean){
        if(!this.calcItem){
            const tabItem = document.createElement("div");
            tabItem.className="tab-item tab-item-calc";
            tabItem.innerHTML=`<i class="tab-remove eboard-icon eboard-icon-remove"></i><span class="tab-item-name"></span>`;
            this.calcItem=tabItem;
            (this.containerRef.current as HTMLDivElement).appendChild(this.calcItem);
        }
        (this.calcItem.querySelector(".tab-remove") as HTMLDivElement).style.display=canRemove?"block":"none";
        (this.calcItem.querySelector(".tab-item-name") as HTMLDivElement).innerText=tabName;

        // 左右margin需要考虑
        const marginLeft = parseInt(document.defaultView.getComputedStyle(this.calcItem,null)["margin-left"],10);
        const marginRight = parseInt(document.defaultView.getComputedStyle(this.calcItem,null)["margin-right"],10);
        return this.calcItem.getBoundingClientRect().width+marginLeft+marginRight;
    }
    private scrollToTab(wbNumber:string,nextShowPager:boolean,removeItemWidth?:number){
        // 如果不存在则最后+1，如果存在则获取存在位置
        const container = this.containerRef.current;
        const scroll = this.scrollRef.current;
        const addBtn = this.addRef.current;
        const addWidth = addBtn.offsetWidth;
        const allWidth = container.offsetWidth;
        const item:HTMLDivElement = scroll.querySelector(`[data-id="${wbNumber}"]`);
        if(item){
            const marginRight = parseInt(document.defaultView.getComputedStyle(item,null)["margin-right"],10);
            const scrollLeft =item.offsetLeft+item.offsetWidth + marginRight - (removeItemWidth||0);// 可能不准确，需要减去removeItemWidth
            let {scrollWidth} = scroll;
            const prevBtnWidth = this.prevRef.current.offsetWidth;
            const nextBtnWidth = this.nextRef.current.offsetWidth;
            const offsetWidth = nextShowPager?allWidth - addWidth-prevBtnWidth-nextBtnWidth:allWidth-addWidth;
            if(scrollLeft<=offsetWidth){
                this.setState({
                    nextDisable:false,
                    prevDisable:true,
                    scrollOffset:0
                })
            }else{
                const scrollOffset = scrollLeft-offsetWidth;
                this.setState({
                    nextDisable:scrollOffset+offsetWidth>=scrollWidth,
                    prevDisable:scrollOffset<=0,
                    scrollOffset
                })
            }
        }
    }
    @Bind
    private removeItem(e:MouseEvent<HTMLDivElement>){
        const target = e.currentTarget.parentElement as HTMLDivElement;
        const tabId = target.getAttribute("data-id") as string;
        this.remove(tabId);
    }
    @Bind
    private onItemClick(e:MouseEvent<HTMLDivElement>){
        const target = e.target as HTMLDivElement;
        if(/tab-remove/.test(target.className)){
            return;
        }
        const tabId = e.currentTarget.getAttribute("data-id") as string;
        this.setActive(tabId);
    }
    @Bind
    private onAddClick(){
        const {config} = this.context;
        const frame:IEmptyFrame = {
            canRemove:true,
            name:config.defaultName,
            type:FRAME_TYPE_ENUM.EMPTY,
            wbNumber:Date.now().toString(),
        };
        this.add(frame);
    }
    @Bind
    private onPrevClick(){
        // offset 80%
        const {scrollOffset} = this.state;
        let scrollWidth = (this.scrollRef.current as HTMLDivElement).offsetWidth;
        const nextOffset = Math.max(scrollOffset-scrollWidth*0.8,0);
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
        const nextOffset = Math.min(Math.max(scrollOffset+offsetWidth*0.8,0),scrollWidth-offsetWidth);
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
        if(boardMap.size===0){
            EBoardContext.updateBoardMap(boardMap,active===false?activeBoard:wbNumber);
            this.setState({
                nextDisable:false,
                prevDisable:false,
                scrollOffset:0,
                showPager:false,
            })
        }else{
            const container = this.containerRef.current;
            const scroll = this.scrollRef.current;
            const addBtn = this.addRef.current;
            const allWidth = container.getBoundingClientRect().width;
            const itemWidth = this.calcItemWidth(tabItem.name,tabItem.canRemove!==false);
            const width = scroll.getBoundingClientRect().width;
            const addWidth = addBtn.getBoundingClientRect().width;
            const {showPager} = this.state;
            const nextShowPager = showPager?showPager:addWidth+width+itemWidth>allWidth;
            if(!nextShowPager){
                this.setState({
                    nextDisable:false,
                    prevDisable:true,
                    scrollOffset:0,
                    showPager:nextShowPager,
                })
            }else{
                const items = scroll.querySelectorAll(".tab-item");
                const last = items[items.length-1] as HTMLDivElement;
                const offsetLeft = last?(last.offsetWidth+last.offsetLeft + parseInt(document.defaultView.getComputedStyle(last,null)["margin-right"],10)):0;
                const scrollLeft = offsetLeft + itemWidth;
                let {scrollWidth} = scroll;
                const prevBtnWidth = this.prevRef.current.offsetWidth;
                const nextBtnWidth = this.nextRef.current.offsetWidth;
                const offsetWidth=allWidth-addWidth-prevBtnWidth-nextBtnWidth;
                const scrollOffset = scrollLeft-offsetWidth;
                this.setState({
                    nextDisable:scrollOffset+offsetWidth>=scrollWidth,
                    prevDisable:scrollOffset<=0,
                    scrollOffset,
                    showPager:nextShowPager,
                })
            }
            EBoardContext.updateBoardMap(boardMap,active===false?activeBoard:wbNumber);
        }
    };
    public remove(wbNumber:string){
        const {boardMap,activeBoard} = this.context;
        boardMap.delete(wbNumber);
        if(boardMap.size===0){
            EBoardContext.updateBoardMap(boardMap,undefined);
            this.setState({
                scrollOffset:0,
                showPager:false,
            })
        }else{
            const container = this.containerRef.current;
            const scroll = this.scrollRef.current;
            const addBtn = this.addRef.current;
            const allWidth = container.getBoundingClientRect().width;
            const item:HTMLDivElement = scroll.querySelector(`[data-id="${wbNumber}"]`);
            const itemWidth = item.getBoundingClientRect().width;
            const scrollWidth = scroll.scrollWidth;
            const addWidth = addBtn.getBoundingClientRect().width;
            const nextActiveId = activeBoard === wbNumber ? boardMap.last().wbNumber : activeBoard;
            const nextShowPager = addWidth + scrollWidth - itemWidth > allWidth;
            EBoardContext.updateBoardMap(boardMap,nextActiveId);
            this.setState({
                showPager: nextShowPager,
            });
            // 如果在active之前则需要reduce itemWidth
            this.scrollToTab(wbNumber,nextShowPager ,itemWidth);// 需要减去当前ItemWidth

        }
    }
    @Bind
    public setActive(wbNumber:string){
        const {showPager} = this.state;
        EBoardContext.updateActiveBoard(wbNumber);
        this.scrollToTab(wbNumber,showPager);
    }
    render(){
        const {showPager,scrollOffset,prevDisable,nextDisable} = this.state;
        const boardList = EBoardContext.getBoardList();
        const {activeBoard} = this.context;
        return (
            <div className="tab-container" ref={this.containerRef}>
                <div className={`tab-scroll ${showPager?"tab-scroll-pager":""}`} ref={this.scrollRef}>
                    <div className="tab-scroll-bar" style={{transform:`translateX(-${scrollOffset}px)`}}>
                        {
                            boardList.map(tab=>(
                                <div className={`tab-item ${activeBoard===tab.wbNumber?"tab-active":""}`} key={tab.wbNumber} data-id={tab.wbNumber} onClick={this.onItemClick}>
                                    {
                                        tab.canRemove!==false?(
                                            <i className="tab-remove eboard-icon eboard-icon-remove" onClick={this.removeItem}/>
                                        ):null
                                    }
                                    <span className="tab-item-name">
                                        {tab.name}
                                    </span>
                                </div>
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