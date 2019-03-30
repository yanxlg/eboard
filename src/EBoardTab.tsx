import {Bind} from "lodash-decorators";
import React,{MouseEvent,RefObject} from "react";
import "./font/iconfont.css";
import "./style/tab.less";


export declare interface ITabItem{
    name:string;
    icon?:string;
    tabId:string;
    canRemove?:boolean;
}

declare interface ITabInterface{
    tabs:ITabItem[];
    showPager:boolean;
    activeId?:string;
    scrollOffset:number;
    prevDisable:boolean;
    nextDisable:boolean;
}

class EBoardTab extends React.Component<{}, ITabInterface>{
    private containerRef:RefObject<HTMLDivElement>=React.createRef();
    private scrollRef:RefObject<HTMLDivElement>=React.createRef();
    private addRef:RefObject<HTMLDivElement>=React.createRef();
    private calcItem:HTMLDivElement;
    private prevBtnWidth:number=0;
    private nextBtnWidth:number=0;
    constructor(props:{}){
        super(props);
        this.state={tabs:[],showPager:false,scrollOffset:0,prevDisable:true,nextDisable:true};
    }
    componentWillUpdate(
        nextProps: Readonly<{}>, nextState: Readonly<ITabInterface>,
        nextContext: any): void {
        const prevBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
        const nextBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
        if(prevBtn&&nextBtn){
            this.prevBtnWidth=prevBtn.offsetWidth;
            this.nextBtnWidth=nextBtn.offsetWidth;
        }
    }
    componentDidUpdate(
        prevProps: Readonly<{}>, prevState: Readonly<ITabInterface>,
        snapshot?: any): void {
        const prevBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
        const nextBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
        if(prevBtn&&nextBtn){
            this.prevBtnWidth=prevBtn.offsetWidth;
            this.nextBtnWidth=nextBtn.offsetWidth;
        }
    }
    private calcItemWidth(tabName:string,canRemove:boolean){
        if(!this.calcItem){
            const tabItem = document.createElement("div");
            tabItem.className="tab-item tab-item-calc";
            tabItem.innerHTML=`<i class="tab-remove eboard-icon eboard-icon-remove"/><span class="tab-item-name"/>`;
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
    private scrollToTab(tabId:string,showPagerChange:boolean){
        const targetTab = (this.containerRef.current as HTMLDivElement).querySelector(`[data-id="${tabId}"]`) as HTMLDivElement;
        const marginRight = parseInt(document.defaultView.getComputedStyle(targetTab,null)["margin-right"],10);
        const scrollLeft =targetTab.offsetLeft+targetTab.offsetWidth + marginRight;
        let {scrollWidth,offsetWidth} = (this.scrollRef.current as HTMLDivElement);
        if(showPagerChange){
            const prevBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
            const nextBtn = (this.containerRef.current as HTMLDivElement).querySelector(".tab-prev") as HTMLDivElement;
            if(prevBtn&&nextBtn){
                offsetWidth=offsetWidth-this.prevBtnWidth-this.nextBtnWidth;
            }else{
                offsetWidth=offsetWidth+this.prevBtnWidth+this.nextBtnWidth;
            }
        }
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
        console.log("add");
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
    public add(tabItem:ITabItem,active?:boolean){
        const {tabId} = tabItem;
        const {tabs,activeId} = this.state;
        const items = (this.containerRef.current as HTMLDivElement).querySelectorAll(".tab-item");
        tabs.push(tabItem);
        if(tabs.length===0||!items||items.length===0){
            this.setState({
                activeId:active===false?activeId:tabId,
                scrollOffset:0,
                showPager:false,
                tabs
            })
        }else{
            const allWidth = (this.containerRef.current as HTMLDivElement).getBoundingClientRect().width;
            // calc nextItemWidth
            const itemWidth = this.calcItemWidth(tabItem.name,tabItem.canRemove!==false);
            const scrollWidth = (this.scrollRef.current as HTMLDivElement).getBoundingClientRect().width;
            const addWidth = (this.addRef.current as HTMLDivElement).getBoundingClientRect().width;
            const {showPager} = this.state;
            const nextShowPager = showPager?showPager:addWidth+scrollWidth+itemWidth>allWidth;
            this.setState({
                activeId:active===false?activeId:tabId,
                showPager:nextShowPager,
                tabs
            },()=>{
                this.scrollToTab(tabId,showPager!==nextShowPager);
            });
        }
    };
    public remove(tabId:string){
        const {tabs,activeId} = this.state;
        const items = (this.containerRef.current as HTMLDivElement).querySelectorAll(".tab-item");
        const index = tabs.findIndex((tab)=>tab.tabId===tabId);
        tabs.splice(index,1);
        if(tabs.length===0||!items||items.length===0){
            this.setState({
                activeId:undefined,
                scrollOffset:0,
                showPager:false,
                tabs
            })
        }else{
            const allWidth = (this.containerRef.current as HTMLDivElement).getBoundingClientRect().width;
            const itemWidth = (items[index] as HTMLDivElement).getBoundingClientRect().width;
            const scrollWidth = (this.scrollRef.current as HTMLDivElement).scrollWidth;
            const addWidth = (this.addRef.current as HTMLDivElement).getBoundingClientRect().width;
            const nextActiveId = activeId === tabId ? tabs[tabs.length - 1].tabId : activeId as string;
            const nextShowPager = addWidth + scrollWidth - itemWidth > allWidth;
            const {showPager} = this.state;
            this.setState({
                activeId: nextActiveId,
                showPager: nextShowPager,
                tabs
            },()=>{
                this.scrollToTab(nextActiveId,showPager!==nextShowPager);
            });
        }
    }
    @Bind
    public setActive(tabId:string){
        this.setState({
            activeId:tabId
        },()=>{
            this.scrollToTab(tabId,false);
        })
    }
    render(){
        const {tabs,showPager,activeId,scrollOffset,prevDisable,nextDisable} = this.state;
        return (
            <div className="tab-container" ref={this.containerRef}>
                <div className={`tab-scroll ${showPager?"tab-scroll-pager":""}`} ref={this.scrollRef}>
                    <div className="tab-scroll-bar" style={{transform:`translateX(-${scrollOffset}px)`}}>
                        {
                            tabs.map(tab=>(
                                <div className={`tab-item ${activeId===tab.tabId?"tab-active":""}`} key={tab.tabId} data-id={tab.tabId} onClick={this.onItemClick}>
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
                {
                    showPager?[
                        <div key="prev" className={`eboard-icon eboard-icon-left-b tab-prev ${prevDisable?"tab-prev-disable":""}`} onClick={this.onPrevClick}/>,
                        <div key="next" className={`eboard-icon eboard-icon-right-b tab-next ${nextDisable?"tab-next-disable":""}`} onClick={this.onNextClick}/>
                    ]:null
                }
                <div className="eboard-icon eboard-icon-append-b tab-add" ref={this.addRef} onClick={this.onAddClick}/>
            </div>
        )
    }
}


export {EBoardTab};