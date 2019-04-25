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
import {EraserBrush} from './derived/EraserBrush';
import {FeruleBrush} from './derived/FeruleBrush';
import {LineBrush} from './derived/LineBrush';
import {PencilBrush} from './derived/PencilBrush';
import {RectBrush} from './derived/RectBrush';
import {SelectBrush} from './derived/SelectBrush';
import {StarBrush} from './derived/StarBrush';
import {TextBoxBrush} from './derived/TextBoxBrush';
import {TriangleBrush} from './derived/TriangleBrush';
import {ArrowDispatch} from './dispatch/ArrowDispatch';
import {CircleDispatch} from './dispatch/CircleDispatch';
import {EraserDispatch} from './dispatch/EraserDispatch';
import {FeruleDispatch} from './dispatch/FeruleDispatch';
import {LineDispatch} from './dispatch/LineDispatch';
import {PencilDispatch} from './dispatch/PencilDispatch';
import {RectDispatch} from './dispatch/RectDispatch';
import {StarDispatch} from './dispatch/StarDispatch';
import {TextBoxDispatch} from './dispatch/TextBoxDispatch';
import {TriangleDispatch} from './dispatch/TriangleDispatch';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IBaseFrame} from './interface/IFrame';
import './style/cursor.less';
import {MessageTag} from './static/MessageTag';
import {Common} from './untils/Common';
import {Cursor} from './untils/Cursor';

fabric.Object.prototype.objectCaching = false;// disable cache

// 部分数据需要进行缓存
const toObject = fabric.Object.prototype.toObject;
fabric.Object.prototype.toObject=function(){
    return fabric.util.object.extend(toObject.call(this), {
        objectId: this["objectId"],
        borderColor:this.borderColor,
        cornerColor:this.cornerColor,
        cornerStrokeColor:this.cornerStrokeColor,
        cornerStyle:this.cornerStyle,
        transparentCorners:this.transparentCorners,
        strokeLineCap:this.strokeLineCap,
        cornerSize:this.cornerSize,
        borderScaleFactor:this.borderScaleFactor
    });
};


declare interface IEBoardCanvas{
    property:IBaseFrame;
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
    private image:HTMLImageElement;
    private imageWidth:number;
    private imageHeight:number;
    private bgObject:fabric.Image;
    private brush:any;
    
    
    private pencilDispatch:PencilDispatch;
    private textDispatch:TextBoxDispatch;
    private lineDispatch:LineDispatch;
    private arrowDispatch:ArrowDispatch;
    private circleDispatch:CircleDispatch;
    private rectDispatch:RectDispatch;
    private starDispatch:StarDispatch;
    private triangleDispatch:TriangleDispatch;
    private eraserDispatch:EraserDispatch;
    private feruleDispatch:FeruleDispatch;
    constructor(props:IEBoardCanvas,context:IEBoardContext) {
        super(props);
        this.initImage(props);
    }
    shouldComponentUpdate(nextProps: Readonly<IEBoardCanvas>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }
    @Bind
    private initImage(props:IEBoardCanvas){
        const {property} = props;
        if(property.wbType===FRAME_TYPE_ENUM.IMAGES){
            this.image=null;
            this.image=new Image();
            this.image.src=property.imageArray[property.pageNum-1];
        }
    }
    @Bind
    private init(){
        // cache restore
        this.fabricCanvas.clear();
        this.initImage(this.props);
        this.layout(this.props);
        const {cacheJSON} = this.props.property;
        if(cacheJSON){
            this.fabricCanvas.loadFromJSON(JSON.parse(cacheJSON),()=>this.fabricCanvas.renderAll());
        }
        // update brush
        this.brush&&this.brush.update(this.props.property.wbNumber,this.props.property.pageNum);
    }
    @Bind
    private destroy(){
        const {wbNumber,pageNum} = this.props.property;
        this.context.setCacheData(JSON.stringify(this.fabricCanvas),wbNumber,pageNum);
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        this.fabricCanvas=new Canvas(container,{
            selection:false,
            skipTargetFind:true,
        });
        this.initBrush(this.context);
        this.initDispatch();
        this.dispatchListener();
        this.init();
    }
    componentWillReceiveProps(nextProps: Readonly<IEBoardCanvas>, nextContext: IEBoardContext): void {
        if(nextProps.width!==this.props.width||nextProps.height!==this.props.height){
            this.layout(nextProps);
        }
        this.initBrush(nextContext);
        if(this.props.property.wbNumber!==nextProps.property.wbNumber||this.props.property.pageNum!==nextProps.property.pageNum){
            this.destroy();
        }
    }
    componentDidUpdate(
        prevProps: Readonly<IEBoardCanvas>, prevState: Readonly<{}>,
        snapshot?: any): void {
        if(this.props.property.wbNumber!==prevProps.property.wbNumber||this.props.property.pageNum!==prevProps.property.pageNum){
            this.init();
        }
    }
    
    componentWillUnmount(): void {
        // 数据cache
        this.destroy();
        this.bgObject=null;
        this.fabricCanvas.dispose();
        this.image=null;
        this.fabricCanvas=null;
        this.brush=null;
        this.pencilDispatch=null;
        this.textDispatch=null;
        this.lineDispatch=null;
        this.arrowDispatch=null;
        this.circleDispatch=null;
        this.rectDispatch=null;
        this.starDispatch=null;
        this.triangleDispatch=null;
        this.eraserDispatch=null;
        this.feruleDispatch=null;
        this.unDispatchListener();
    }
    @Bind
    private clearListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber === property.wbNumber&&pageNum === currentPageNum){
            this.clear();
            if(data.evented){
                this.context.onMessageListener({
                    tag:MessageTag.Clear,
                    wbNumber,
                    pageNum
                });
            }
        }
    }
    @Bind
    private pencilListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.pencilDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private textListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.textDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private lineListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.lineDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private arrowListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.arrowDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private circleListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.circleDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private rectListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.rectDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private starListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.starDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private triangleListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.triangleDispatch.onDraw(objectId,timestamp,attributes);
        }
    }
    @Bind
    private deleteListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectIds} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.eraserDispatch.onDraw(objectIds);
        }
    }
    @Bind
    private feruleListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,attributes} = data;
        const {property,width,dimensions} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.feruleDispatch.onDraw(attributes,dimensions.width/width);
        }
    }
    @Bind
    private dispatchListener(){
        this.context.eventEmitter.on(EventList.Clear,this.clearListener);
        this.context.eventEmitter.on(EventList.DrawPencil, this.pencilListener);
        this.context.eventEmitter.on(EventList.DrawText, this.textListener);
        this.context.eventEmitter.on(EventList.DrawLine, this.lineListener);
        this.context.eventEmitter.on(EventList.DrawArrow, this.arrowListener);
        this.context.eventEmitter.on(EventList.DrawCircle, this.circleListener);
        this.context.eventEmitter.on(EventList.DrawRect, this.rectListener);
        this.context.eventEmitter.on(EventList.DrawStar, this.starListener);
        this.context.eventEmitter.on(EventList.DrawTriangle, this.triangleListener);
        this.context.eventEmitter.on(EventList.Delete, this.deleteListener);
        this.context.eventEmitter.on(EventList.Ferule,this.feruleListener);
    }
    @Bind
    private unDispatchListener(){
        this.context.eventEmitter.off(EventList.Clear,this.clearListener);
        this.context.eventEmitter.off(EventList.DrawPencil, this.pencilListener);
        this.context.eventEmitter.off(EventList.DrawText, this.textListener);
        this.context.eventEmitter.off(EventList.DrawLine, this.lineListener);
        this.context.eventEmitter.off(EventList.DrawArrow, this.arrowListener);
        this.context.eventEmitter.off(EventList.DrawCircle, this.circleListener);
        this.context.eventEmitter.off(EventList.DrawRect, this.rectListener);
        this.context.eventEmitter.off(EventList.DrawStar, this.starListener);
        this.context.eventEmitter.off(EventList.DrawTriangle, this.triangleListener);
        this.context.eventEmitter.off(EventList.Delete, this.deleteListener);
        this.context.eventEmitter.off(EventList.Ferule,this.feruleListener);
    }
    @Bind
    private layout(props:IEBoardCanvas){
        let {width:canvasWidth,height:canvasHeight,property} = props;
        const dimensions = Object.assign({},props.dimensions);
        const {wbType} = property;
        if(!this.fabricCanvas){return}
        switch (wbType) {
            case FRAME_TYPE_ENUM.EMPTY:
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                break;
            case FRAME_TYPE_ENUM.IMAGES:
            case FRAME_TYPE_ENUM.PDF:
                // 先铺满默认区域
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                // get image size
                Common.getImageSize(this.image,(size?:{width:number;height:number})=>{
                   if(void 0 === size||!this.fabricCanvas){
                       return;
                   }
                   this.imageWidth=size.width;
                   this.imageHeight=size.height;
                    const {layoutMode} = property;
                    const {width,height} = dimensions;
                    if(layoutMode==="top_auto"){
                        // scroll enable
                        const imageRatio = this.imageHeight/this.imageWidth;
                        if(height/width<imageRatio){
                            dimensions.height=dimensions.width*imageRatio;
                            this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasWidth*imageRatio});// 设置样式大小
                            this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                            Common.imgeLoaded(this.image,()=>{
                                this.bgObject = new fabric.Image(this.image, {
                                    height: size.height,
                                    left: 0,
                                    top: 0,
                                    width: size.width,
                                    scaleX:dimensions.width/size.width,
                                    scaleY:dimensions.height/size.height
                                });
                                this.fabricCanvas.backgroundImage=this.bgObject;
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
                        this.bgObject = new fabric.Image(this.image, {
                            height: size.height,
                            left: (width - imageW) / 2,
                            top: (height - imageH) / 2,
                            width: size.width,
                            scaleX:imageW/size.width,
                            scaleY:imageH/size.height
                        });
                        this.fabricCanvas.backgroundImage=this.bgObject;
                        this.fabricCanvas.renderAll();
                    });
                });
                break;
            default:
                break;
        }
    }
    @Bind
    private initBrush(context:IEBoardContext){
        const {config} = context;
        const {toolType,shapeType,shapeColor,pencilColor,pencilWidth,strokeWidth,fontSize,fontColor} = config;
        const {property} = this.props;
        const {wbNumber,pageNum} = property as any;
        if(this.brush&&this.brush.destroy){
            this.brush.destroy();
        }
        switch (toolType) {
            case TOOL_TYPE.Select:
                this.fabricCanvas.isDrawingMode=false;
                this.fabricCanvas.freeDrawingBrush=null;
                this.fabricCanvas.freeDrawingCursor=null;
                this.fabricCanvas.setCursor(Cursor.default);
                this.fabricCanvas.defaultCursor=Cursor.default;
                this.brush = new SelectBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                break;
            case TOOL_TYPE.Pencil:
                this.fabricCanvas.isDrawingMode=true;
                this.brush = new PencilBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                this.fabricCanvas.freeDrawingCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                this.brush.width=pencilWidth;
                this.brush.color=pencilColor;
                this.fabricCanvas.freeDrawingBrush = this.brush;
                break;
            case TOOL_TYPE.Text:
                this.fabricCanvas.isDrawingMode=false;
                this.fabricCanvas.freeDrawingBrush=null;
                this.fabricCanvas.freeDrawingCursor=null;
                this.brush = new TextBoxBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                this.fabricCanvas.defaultCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                this.brush.fontSize = fontSize;
                this.brush.fontColor = fontColor;
                break;
            case TOOL_TYPE.Shape:
                switch (shapeType) {
                    case SHAPE_TYPE.Arrow:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new ArrowBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.width=strokeWidth;
                        this.brush.stroke=shapeColor;
                        this.brush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Line:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new LineBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.width=strokeWidth;
                        this.brush.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Circle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new CircleBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowCircle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new CircleBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=shapeColor;
                        this.brush.width=strokeWidth;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Star:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new StarBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowStar:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new StarBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=shapeColor;
                        this.brush.width=strokeWidth;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Triangle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new TriangleBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowTriangle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new TriangleBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Rect:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new RectBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowRect:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new RectBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=shapeColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                }
                break;
            case TOOL_TYPE.Eraser:
                this.fabricCanvas.isDrawingMode=false;
                this.brush = new EraserBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                this.fabricCanvas.freeDrawingBrush=null;
                break;
            case TOOL_TYPE.Ferule:
                this.fabricCanvas.isDrawingMode=false;
                this.fabricCanvas.freeDrawingBrush=null;
                this.fabricCanvas.freeDrawingCursor=null;
                this.brush = new FeruleBrush(this.fabricCanvas,this.context,wbNumber,pageNum);
                this.fabricCanvas.defaultCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                break;
        }
    }
    private clear(){
        this.fabricCanvas.clear();
        // 背景图需要保留
        if(this.bgObject){
            this.fabricCanvas.backgroundImage=this.bgObject;
        }
    }
    @Bind
    private initDispatch(){
        this.pencilDispatch=new PencilDispatch(this.fabricCanvas,this.context);
        this.textDispatch=new TextBoxDispatch(this.fabricCanvas,this.context);
        this.lineDispatch=new LineDispatch(this.fabricCanvas,this.context);
        this.arrowDispatch=new ArrowDispatch(this.fabricCanvas,this.context);
        this.circleDispatch=new CircleDispatch(this.fabricCanvas,this.context);
        this.rectDispatch=new RectDispatch(this.fabricCanvas,this.context);
        this.starDispatch=new StarDispatch(this.fabricCanvas,this.context);
        this.triangleDispatch=new TriangleDispatch(this.fabricCanvas,this.context);
        this.eraserDispatch=new EraserDispatch(this.fabricCanvas,this.context);
        this.feruleDispatch=new FeruleDispatch(this.fabricCanvas,this.context);
    }
    render(){
        return (
            <canvas ref={this.containerRef}/>
        )
    }
}

export {EBoardCanvas};