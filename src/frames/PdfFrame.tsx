/**
 * @disc:Pdf
 * @author:yanxinaliang
 * @time：2019/4/7 19:13
 */
import {Bind} from 'lodash-decorators';
import React from "react";
import {Pagination} from '../components/pagination';
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import {FRAME_TYPE_ENUM} from '../enums/EBoardEnum';
import {IPdfFrame} from '../interface/IFrame';
import PDFJS, {
    PDFDocumentProxy,
    PDFLoadingTask,
} from 'pdfjs-dist';
import {FrameMap} from '../static/FrameMap';
import {PdfItemFrame} from './PdfItemFrame';


declare interface IPdfFrameProps extends IPdfFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
}


declare interface IPdfFrameState {
    total:number;
    animationClass:string;
    pdf?:PDFJS.PDFDocumentProxy;
}

class PdfFrame extends React.PureComponent<IPdfFrameProps,IPdfFrameState>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private readonly pdfLoader:PDFLoadingTask<PDFDocumentProxy>;
    constructor(props:IPdfFrameProps,context:IEBoardContext){
        super(props);
        this.state={
            total:0,
            animationClass:"board-frames-right"
        };
        const url = props.filePath;
        this.pdfLoader=PDFJS.getDocument(url);
        this.pdfLoader.promise.then(pdf=>{
            this.setState({
                total:pdf.numPages,
                pdf
            });
        });
        FrameMap.setChild(props.wbNumber,undefined,this);
    }
    @Bind
    private getChildes(){
        const {frames,wbNumber,pageNo,width,height,dimensions} = this.props;
        let pdfItemFrames:React.ReactNode[]=[];
        const {pdf} = this.state;
        frames.forEach((frame,key)=>{
            frame.render&&pdfItemFrames.push(<PdfItemFrame pdf={pdf} {...frame} key={key} wbNumber={wbNumber} active={pageNo===key} width={width} height={height} dimensions={dimensions}/>);
        });
        return pdfItemFrames;
    }
    @Bind
    private onPageChange(pageNo:number){
        const {wbNumber} = this.props;
        const {boardMap} = this.context;
        let pdfFrame = boardMap.get(wbNumber) as IPdfFrame;
        const oldPageNo = pdfFrame.pageNo;
        if(oldPageNo===pageNo){return}
        pdfFrame.pageNo=pageNo;
        const pdfItemFrame = pdfFrame.frames.get(pageNo);
        if(pdfItemFrame){
            pdfItemFrame.render=true;
        }else{
            pdfFrame.frames.set(pageNo,{
                type:FRAME_TYPE_ENUM.PDFTASK,
                pageNo,
                render:true,
                layoutMode:"top_auto",
                wbNumber:wbNumber+"."+pageNo,
            });
        }
        this.context.updateBoardMap(boardMap);
        this.setState({
            animationClass:oldPageNo<pageNo?"board-frames-right":"board-frames-left"
        })
    }
    componentWillUnmount(): void {
        FrameMap.removeChild(this.props.wbNumber);
    }
    render(){
        const {active,width,height} = this.props;
        const {pdf,total,animationClass} = this.state;
        return (
            <div className={`board-frames ${active?"board-frame-active":""} ${animationClass}`} style={{width,height}}>
                {
                   pdf&&this.getChildes()
                }
                {
                    total>0?<Pagination defaultCurrent={1} total={total} onChange={this.onPageChange}/>:null
                }
            </div>
        )
    }
}

export {PdfFrame}