/**
 * @disc:PdfItemFrame
 * @author:yanxinaliang
 * @time：2019/4/9 22:00
 */
import PDFJS, {PDFRenderParams} from 'pdfjs-dist';
import React, {RefObject} from 'react';
import {EBoardCanvas} from '../EBoardCanvas';
import {FRAME_TYPE_ENUM} from '../enums/EBoardEnum';
import {IImageFrame, IPdfItemFrame} from '../interface/IFrame';
import "../style/frames.less";
import PerfectScrollbar from "kxt-web/lib/perfectscrollbar";

declare interface IPdfItemFrameProps extends IPdfItemFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
    pdf:PDFJS.PDFDocumentProxy;
}


declare interface IPdfItemFrameState {
    dataUrl?:string;
}

class PdfItemFrame extends React.PureComponent<IPdfItemFrameProps,IPdfItemFrameState>{
    private scrollRef:RefObject<PerfectScrollbar>=React.createRef();
    private readonly _cacheCanvas:HTMLCanvasElement;
    constructor(props:IPdfItemFrameProps){
        super(props);
        this.state={};
        this._cacheCanvas=document.createElement("canvas");
        const {pdf,pageNo} = props;
        pdf.getPage(pageNo).then(page=>{
            const canvas = this._cacheCanvas;
            const defaultViewport = page.getViewport(1/window.devicePixelRatio);
            // defaultViewport.width
            const scale = 1920/defaultViewport.width;
            const viewport = page.getViewport(scale);
            canvas.width=viewport.width;
            canvas.height=viewport.height;
            const renderContext:PDFRenderParams={
                canvasContext: canvas.getContext("2d"),
                viewport
            };
            page.render(renderContext).promise.then(()=>{
                const dataUrl = this._cacheCanvas.toDataURL("image/png");
                this.setState({
                    dataUrl
                })
            },()=>{
                this.setState({
                    dataUrl:""
                })
            });
        })
    }
    componentDidUpdate(
        prevProps: Readonly<IPdfItemFrameProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
        this.scrollRef.current.update();
    }
    render(){
        const {active,width,height,dimensions,render,wbNumber} = this.props;
        const {dataUrl} = this.state;
        const imageFrameOptions:IImageFrame={
            image:dataUrl,
            layoutMode:"top_auto",
            render,
            type:FRAME_TYPE_ENUM.IMAGE,
            wbNumber
        };
        return (
            <PerfectScrollbar ref={this.scrollRef} className={`board-frame ${active?"board-frame-active":""}`} style={{width,height}}>
                {
                    void 0 === dataUrl?null:
                        <EBoardCanvas property={imageFrameOptions} dimensions={dimensions} height={height} width={width}/>
                }
            </PerfectScrollbar>
        )
    }
}

export {PdfItemFrame}