/**
 * image 默认contain，支持设置auto
 */
import {fabric} from "fabric";
import {Bind} from "lodash-decorators";
import React, {RefObject} from 'react';
import {ArrowBrush} from './derived/ArrowBrush';
import {Canvas} from "./derived/Canvas";
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from "./enums/EBoardEnum";
import {IEmptyFrame, IImageFrame} from "./interface/IFrame";


declare interface IEBoardCanvas{
    className?:string;
    frameProperty:IEmptyFrame|IImageFrame;
}

class EBoardCanvas extends React.Component<IEBoardCanvas>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLCanvasElement>=React.createRef();
    private fabricCanvas:Canvas;
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
    shouldComponentUpdate(nextProps: Readonly<IEBoardCanvas>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        const {width,height,dimensions} = this.calc();
        this.fabricCanvas=new Canvas(container,{
            containerClass:this.props.className,
            selection:false,
            skipTargetFind:true
        });
        this.fabricCanvas.setDimensions({width,height});// 设置样式大小
        this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
    
        const property = this.props.frameProperty;
        const {type} = property;
        switch (type) {
            case FRAME_TYPE_ENUM.EMPTY:
                break;
            case FRAME_TYPE_ENUM.IMAGE:
                const {image,imageHeight,imageWidth} = property as IImageFrame;
                const imageElement = new Image();
                imageElement.src=image;
                const {width,height} = this.fabricCanvas;
                // calc 图片大小
                let imageW=0,imageH=0;
                const xRatio = width / imageWidth;
                const yRatio = height / imageHeight;
                if(xRatio > yRatio){
                    imageH=height;
                    imageW=height*imageWidth/imageHeight;
                }else{
                    imageW=width;
                    imageH=width*imageHeight/imageWidth;
                }
                const fabricImage = new fabric.Image(imageElement,{
                    height:imageH,
                    left:(width - imageW)/2,
                    top:(height - imageH)/2,
                    width:imageW,
                });
                this.fabricCanvas.backgroundImage=fabricImage;
                break;
        }
    
        this.fabricCanvas.isDrawingMode=true;
    
        const brush = new ArrowBrush(this.fabricCanvas);
        brush.width=3;
        brush.color="red";
        this.fabricCanvas.freeDrawingBrush = brush;
        brush.onMouseDown(new fabric.Point(0,0));
        fabric.util.animate({
            byValue:100,
            duration: 1000,
            endValue: 100,
            startValue: 0,
            onChange(value:number){
                brush.onMouseMove(new fabric.Point(value,value));// 中心点
                // circleBrush.render();
            },
            onComplete:()=>{
                brush.onMouseUp();// 中心点
                console.log("COMPLETE");
            }
        });
        

    }
    componentWillReceiveProps(nextProps: Readonly<IEBoardCanvas>, nextContext: any): void {
        const {className} = nextProps;
        if(this.props.className!==className){
            this.fabricCanvas.setContainerClass(className);
        }
    }
    componentWillUnmount(): void {
        this.fabricCanvas.dispose();
    }
    render(){
        return (
            <canvas ref={this.containerRef}/>
        )
    }
}

export {EBoardCanvas};