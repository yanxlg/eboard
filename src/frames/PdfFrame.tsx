/**
 * @disc:Pdf
 * @author:yanxinaliang
 * @time：2019/4/7 19:13
 */
import {Bind} from 'lodash-decorators';
import React from "react";
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import {IImagesFrame} from '../interface/IFrame';
import {ImageFrame} from './ImageFrame';
import PDFJS, {
    PDFDocumentProxy,
    PDFLoadingTask, PDFRenderParams,
} from 'pdfjs-dist';


declare interface IPdfFrameProps extends IImagesFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    pdfUrl:string;
    active:boolean;
}

class PdfFrame extends React.PureComponent<IPdfFrameProps>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private readonly pdfLoader:PDFLoadingTask<PDFDocumentProxy>;
    private _cacheCanvas:HTMLCanvasElement;
    constructor(props:IPdfFrameProps,context:IEBoardContext){
        super(props);
        this._cacheCanvas=document.createElement("canvas");
     
        const url = props.pdfUrl||"https://res2dev.9itest.com/resource2/1000/document/20190404/d6e7818316644e7c82191d298a0c5345.pdf";
        this.pdfLoader=PDFJS.getDocument(url);
        this.pdfLoader.promise.then(pdf=>{
            console.log(pdf.numPages);// 设置分页总数
            pdf.getPage(1).then(page=>{
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
                    console.log(this._cacheCanvas.toDataURL("image/png"));
                    console.log(props.wbNumber);
             /*       const frameMap = context.boardMap.get(props.wbNumber) as IImagesFrame;
                    frameMap.children.set(1,{
                        type:FRAME_TYPE_ENUM.IMAGE,
                        wbNumber:"444",
                        name:"图片",
                        image:this._cacheCanvas.toDataURL("image/png"),
                        imageHeight:0,
                        imageWidth:0,
                        layoutMode:"top_auto"
                    });
                    context.updateBoardMap(context.boardMap);*/
                },()=>{
                    console.log("error");
                });
            })
        });
    }
    @Bind
    private getChildes(){
        const {frames,wbNumber,pageNo,width,height,dimensions} = this.props;
        let imageFrames:React.ReactNode[]=[];
        frames.forEach((frame,key)=>{
            frame.render&&imageFrames.push(<ImageFrame {...frame} key={key} wbNumber={`${wbNumber}.${key}`} active={pageNo===key} width={width} height={height} dimensions={dimensions}/>);
        });
        return imageFrames;
    }
    render(){
        const {active,width,height} = this.props;
        return (
            <div className={`board-frames ${active?"board-frame-active":""}`} style={{width,height}}>
                {
                    this.getChildes()
                }
            </div>
        )
    }
}

export {PdfFrame}