/**
 * @disc:ResizeEmitter Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:55
 */
import {Bind,Debounce} from "lodash-decorators";
import React, {RefObject} from 'react';
import "./style/layout.less";
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';

class ResizeEmitter extends React.PureComponent{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private iframeRef:RefObject<HTMLIFrameElement>=React.createRef();
    @Bind
    @Debounce(300)
    private onResize(){
        const iframe = this.iframeRef.current;
        const {offsetWidth,offsetHeight} = iframe;
        this.context.eventEmitter.trigger(EventList.Resize,{offsetWidth,offsetHeight});
    }
    componentDidMount(): void {
        const iframe = this.iframeRef.current;
        const contentWindow = iframe.contentWindow;
        contentWindow.addEventListener("resize",this.onResize);
    }
    componentWillUnmount(): void {
        const iframe = this.iframeRef.current;
        const contentWindow = iframe.contentWindow;
        contentWindow.removeEventListener("resize",this.onResize);
    }
    render(){
        return (
            <iframe ref={this.iframeRef} className="layout-board-iframe" frameBorder={"0"} seamless={true} marginHeight={0} marginWidth={0}/>
        )
    }
}

export {ResizeEmitter};