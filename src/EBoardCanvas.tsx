/**
 * image 默认contain，支持设置auto
 */
import {fabric} from 'fabric';
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {SHAPE_TYPE, TOOL_TYPE} from './Config';
import {ArrowBrush} from './derived/ArrowBrush';
import {Canvas} from './derived/Canvas';
import {CircleBrush} from './derived/CircleBrush';
import {LineBrush} from './derived/LineBrush';
import {PencilBrush} from './derived/PencilBrush';
import {RectBrush} from './derived/RectBrush';
import {StarBrush} from './derived/StarBrush';
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IFrame, IImageFrame} from './interface/IFrame';
import './style/cursor.less';
import {Common} from './untils/Common';
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
        let {width:canvasWidth,height:canvasHeight,property} = props;
        const dimensions = Object.assign({},props.dimensions);
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
                            dimensions.height=dimensions.width*imageRatio;
                            this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasWidth*imageRatio});// 设置样式大小
                            this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                            Common.imgeLoaded(this.image,()=>{
                                this.fabricCanvas.backgroundImage=new fabric.Image(this.image, {
                                    height: size.height,
                                    left: 0,
                                    top: 0,
                                    width: size.width,
                                    scaleX:dimensions.width/size.width,
                                    scaleY:dimensions.height/size.height
                                });
                                this.fabricCanvas.renderAll();
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
                    Common.imgeLoaded(this.image,()=>{
                        this.fabricCanvas.backgroundImage=new fabric.Image(this.image, {
                            height: size.height,
                            left: (width - imageW) / 2,
                            top: (height - imageH) / 2,
                            width: size.width,
                            scaleX:imageW/size.width,
                            scaleY:imageH/size.height
                        });
                        this.fabricCanvas.renderAll();
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
    @Bind
    private initBrush(context:IEBoardContext){
        const {config} = context;
        const {toolType,shapeType,shapeColor,pencilColor,pencilWidth,strokeWidth} = config;
        switch (toolType) {
            case TOOL_TYPE.Select:
                break;
            case TOOL_TYPE.Pencil:
                this.fabricCanvas.isDrawingMode=true;
                let pencilBrush = new PencilBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                this.fabricCanvas.freeDrawingCursor=pencilBrush.cursorType||Cursor.cross;
                pencilBrush.width=pencilWidth;
                pencilBrush.color=pencilColor;
                this.fabricCanvas.freeDrawingBrush = pencilBrush;
                break;
            case TOOL_TYPE.Text:
                this.fabricCanvas.isDrawingMode=true;
               /* brush = new PencilBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                this.fabricCanvas.freeDrawingCursor=brush.cursorType||Cursor.cross;
                brush.width=2;
                brush.color="red";
                // @ts-ignore
                brush.stroke="red";
                this.fabricCanvas.freeDrawingBrush = brush;*/
                break;
            case TOOL_TYPE.Shape:
                switch (shapeType) {
                    case SHAPE_TYPE.Arrow:
                        this.fabricCanvas.isDrawingMode=true;
                        let arrowBrush = new ArrowBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=arrowBrush.cursorType||Cursor.cross;
                        arrowBrush.width=strokeWidth;
                        arrowBrush.stroke=shapeColor;
                        arrowBrush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = arrowBrush;
                        break;
                    case SHAPE_TYPE.Line:
                        this.fabricCanvas.isDrawingMode=true;
                        let lineBrush = new LineBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=lineBrush.cursorType||Cursor.cross;
                        lineBrush.width=strokeWidth;
                        lineBrush.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = lineBrush;
                        break;
                    case SHAPE_TYPE.Circle:
                        this.fabricCanvas.isDrawingMode=true;
                        let circleBrush = new CircleBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=circleBrush.cursorType||Cursor.cross;
                        circleBrush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = circleBrush;
                        break;
                    case SHAPE_TYPE.HollowCircle:
                        this.fabricCanvas.isDrawingMode=true;
                        let circleBrush_1 = new CircleBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=circleBrush_1.cursorType||Cursor.cross;
                        circleBrush_1.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = circleBrush_1;
                        break;
                    case SHAPE_TYPE.Star:
                        this.fabricCanvas.isDrawingMode=true;
                        let starBrush = new StarBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=starBrush.cursorType||Cursor.cross;
                        starBrush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = starBrush;
                        break;
                    case SHAPE_TYPE.HollowStar:
                        this.fabricCanvas.isDrawingMode=true;
                        let starBrush_1 = new StarBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=starBrush_1.cursorType||Cursor.cross;
                        starBrush_1.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = starBrush_1;
                        break;
                    case SHAPE_TYPE.Triangle:
               /*         let triangleBrush = new StarBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=starBrush.cursorType||Cursor.cross;
                        starBrush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = starBrush;*/
                        break;
                    case SHAPE_TYPE.HollowTriangle:
                   /*     let starBrush_1 = new StarBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=starBrush_1.cursorType||Cursor.cross;
                        starBrush_1.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = starBrush_1;*/
                        break;
                    case SHAPE_TYPE.Rect:
                        this.fabricCanvas.isDrawingMode=true;
                        const rectBrush = new RectBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=rectBrush.cursorType||Cursor.cross;
                        rectBrush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = rectBrush;
                        break;
                    case SHAPE_TYPE.HollowRect:
                        this.fabricCanvas.isDrawingMode=true;
                        const rectBrush_1 = new RectBrush(this.fabricCanvas,this.context.config,this.context.idGenerator);
                        this.fabricCanvas.freeDrawingCursor=rectBrush_1.cursorType||Cursor.cross;
                        rectBrush_1.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = rectBrush_1;
                        break;
                }
                break;
        }
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        this.fabricCanvas=new Canvas(container,{
            selection:false,
            skipTargetFind:true
        });
        this.layout(this.props);
        
        this.initBrush(this.context);
        
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
        this.initBrush(nextContext);
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