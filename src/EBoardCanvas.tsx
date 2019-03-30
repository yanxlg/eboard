import {fabric} from "fabric";
import {Bind} from "lodash-decorators";
import React, {RefObject} from 'react';
import {EBoardContext, IEBoardContext} from './EBoardContext';

declare interface IEBoardCanvas {
    className?:string;
    bgImage?:string;
}

class EBoardCanvas extends React.PureComponent<IEBoardCanvas>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLCanvasElement>=React.createRef();
    private fabricCanvas:fabric.Canvas;
    @Bind
    private calc(){
        const parentElement = this.containerRef.current.parentElement.parentElement;
        const {offsetWidth:width,offsetHeight:height} = parentElement;
        const ratio = this.context.config.ratio;
        const ratioW=ratio.w;
        const ratioH=ratio.h;
        const ratioNum=ratioW/ratioH;
        const defaultDimensionW = this.context.config.dimensions.width;
        let w:number,h:number;
        if(width/height>ratioNum){
            w = height * ratioNum;
            h = height;
        }else{
            w = width;
            h = width / ratioNum;
        }
        return {
            dimensions:{
                height:defaultDimensionW * h/w,
                width:defaultDimensionW,
            },
            height:h,
            originWidth:w,
            scale:1,
            width:w
        };
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        const {width,height,dimensions} = this.calc();
        this.fabricCanvas=new fabric.Canvas(container,{
            containerClass:this.props.className,
            selection:false,
            skipTargetFind:true
        });
        this.fabricCanvas.setDimensions({width,height});// 设置样式大小
        this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
    
        this.fabricCanvas.isDrawingMode=true;
        // @ts-ignore
        const brush = new fabric.PencilBrush(this.fabricCanvas);
        brush.width=3;
        brush.color="red";
        // @ts-ignore
        this.fabricCanvas.freeDrawingBrush = brush;
        
        const {bgImage} = this.props;
        if(bgImage){
            this.fabricCanvas.getElement().parentElement.style.background=`url("${bgImage}")`;
        }
    }
    render(){
        return (
            <canvas ref={this.containerRef}/>
        )
    }
}

export {EBoardCanvas};