/**
 * image 默认contain，支持设置auto
 */
import {fabric} from 'fabric';
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {Canvas} from './derived/Canvas';
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IFrame, IImageFrame} from './interface/IFrame';
import {Common} from './untils/Common';
import "./style/cursor.less";
import {Cursor} from './untils/Cursor';

declare interface IEBoardCanvas{
    property:IFrame;
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    }
}

class EBoardCanvas extends React.Component<IEBoardCanvas>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private containerRef:RefObject<HTMLCanvasElement>=React.createRef();
    private fabricCanvas:Canvas;
    private readonly image:HTMLImageElement;
    private imageWidth:number;
    private imageHeight:number;
    constructor(props:IEBoardCanvas,context:IEBoardContext) {
        super(props);
        const {property} = props;
        if(property.type===FRAME_TYPE_ENUM.IMAGE){
            this.image=new Image();
            this.image.src=(property as IImageFrame).image;
        }
    }
    
    @Bind
    private layout(props:IEBoardCanvas){
        let {width:canvasWidth,height:canvasHeight,dimensions,property} = props;
        const {type} = property;
        switch (type) {
            case FRAME_TYPE_ENUM.EMPTY:
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                break;
            case FRAME_TYPE_ENUM.IMAGE:
                // 先铺满默认区域
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                // get image size
                Common.getImageSize(this.image,(size?:{width:number;height:number})=>{
                   if(void 0 === size){
                       return;
                   }
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
                            this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasWidth*imageRatio});// 设置样式大小
                            this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                            this.fabricCanvas.backgroundImage=new fabric.Image(this.image, {
                                height: dimensions.height,
                                left: 0,
                                top: 0,
                                width: dimensions.width,
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
            selection:false,
            skipTargetFind:true
        });
        this.layout(this.props);
        const {brush:Brush} = this.context;
        if(Brush){
            this.fabricCanvas.isDrawingMode=true;
            const brush = new Brush(this.fabricCanvas,this.context.config,this.context.idGenerator);
            this.fabricCanvas.freeDrawingCursor=brush.cursorType||Cursor.cross;
            brush.width=2;
            brush.color="red";
            // @ts-ignore
            brush.stroke="red";
            this.fabricCanvas.freeDrawingBrush = brush;
        }
        
        
        
/*
        this.fabricCanvas.isDrawingMode=true;
        const brush = new StarBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
        brush.width=3;
        brush.color="red";
        this.fabricCanvas.freeDrawingBrush = brush;
        brush.onMouseDown(new fabric.Point(0,0),"2");
        fabric.util.animate({
            byValue:100,
            duration: 1000,
            endValue: 100,
            startValue: 0,
            onChange(value:number){
                brush.onMouseMove(new fabric.Point(value,value),"2");// 中心点
                // circleBrush.render();
            },
            onComplete:()=>{
                brush.onMouseUp();// 中心点
                console.log("COMPLETE");
            }
        });*/
    }
    componentWillReceiveProps(nextProps: Readonly<IEBoardCanvas>, nextContext: IEBoardContext): void {
        if(nextProps.width!==this.props.width||nextProps.height!==this.props.height){
            this.layout(nextProps);
        }
        const {brush:Brush} = nextContext;
        if(Brush){
            this.fabricCanvas.isDrawingMode=true;
            const brush = new Brush(this.fabricCanvas,this.context.config,this.context.idGenerator);
            this.fabricCanvas.freeDrawingCursor=brush.cursorType||Cursor.cross;
            brush.width=2;
            brush.color="red";
            // @ts-ignore
            brush.stroke="red";
            this.fabricCanvas.freeDrawingBrush = brush;
        }else{
            this.fabricCanvas.isDrawingMode=false;
            this.fabricCanvas.freeDrawingBrush = undefined;
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