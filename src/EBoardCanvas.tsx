/**
 * image 默认contain，支持设置auto
 */
import {fabric} from "fabric";
import {Bind} from "lodash-decorators";
import React, {RefObject} from 'react';
import {Canvas} from "./derived/Canvas";
import {LineBrush} from './derived/LineBrush';
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from "./enums/EBoardEnum";
import {IFrame, IImageFrame} from "./interface/IFrame";
import {Common} from "./untils/Common";


declare interface IEBoardCanvas{
    className?:string;
    property:IFrame;
}

class EBoardCanvas extends React.Component<IEBoardCanvas>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLCanvasElement>=React.createRef();
    private fabricCanvas:Canvas;
    private image:HTMLImageElement;
    private imageWidth:number;
    private imageHeight:number;

    constructor(props:IEBoardCanvas) {
        super(props);
        const {property} = props;
        if(property.type===FRAME_TYPE_ENUM.IMAGE){
            this.imageWidth=(property as IImageFrame).imageWidth;
            this.imageHeight=(property as IImageFrame).imageHeight;
            this.image=new Image();
            this.image.src=(property as IImageFrame).image;
        }
    }
    @Bind
    private onResize(){
        this.layout();
    }
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
    @Bind
    private layout(){
        let {width:canvasWidth,height:canvasHeight,dimensions} = this.calc();
        const property = this.props.property;
        const {type} = property;
        switch (type) {
            case FRAME_TYPE_ENUM.EMPTY:
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                break;
            case FRAME_TYPE_ENUM.IMAGE:
                if(!this.imageWidth||!this.imageHeight){
                    // image size unknow
                    this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                    this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                }
                // get image size
                Common.getImageSize(this.image,(size?:{width:number;height:number})=>{
                   if(void 0 === size){return}
                   this.imageWidth=size.width;
                   this.imageHeight=size.height;
                    const {layoutMode} = property as IImageFrame;
                    const {width,height} = dimensions;
                    if(layoutMode==="top_auto"){
                        // scroll enable
                        const imageRatio = this.imageHeight/this.imageWidth;
                        if(height/width<imageRatio){
                            canvasHeight = width*imageRatio;
                            dimensions.height=dimensions.width*imageRatio;
                            this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                            this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                            this.fabricCanvas.backgroundImage=new fabric.Image(this.image, {
                                height: canvasHeight,
                                left: 0,
                                top: 0,
                                width: canvasWidth,
                            });
                            return;
                        }
                    }
                    // without scroll
                    this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                    this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小

                    // calc 图片大小
                    let imageW=0,imageH=0;
                    const xRatio = width / this.imageWidth;
                    const yRatio = height / this.imageHeight;
                    if(xRatio > yRatio){
                        imageH=height;
                        imageW=height*this.imageWidth/this.imageHeight;
                    }else{
                        imageW=width;
                        imageH=width*this.imageHeight/this.imageWidth;
                    }
                    this.fabricCanvas.backgroundImage=new fabric.Image(this.image, {
                        height: imageH,
                        left: (width - imageW) / 2,
                        top: (height - imageH) / 2,
                        width: imageW,
                    });
                });
                break;
            default:
                break;
        }
    }
    shouldComponentUpdate(nextProps: Readonly<IEBoardCanvas>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        this.fabricCanvas=new Canvas(container,{
            containerClass:this.props.className,
            selection:false,
            skipTargetFind:true
        });
        this.layout();


        this.fabricCanvas.isDrawingMode=true;
        const brush = new LineBrush(this.fabricCanvas);
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