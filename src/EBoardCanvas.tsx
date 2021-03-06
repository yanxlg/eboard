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
import {ITextBrush} from './derived/ITextBrush';
import {TriangleBrush} from './derived/TriangleBrush';
import {ArrowDispatch} from './dispatch/ArrowDispatch';
import {CircleDispatch} from './dispatch/CircleDispatch';
import {EraserDispatch} from './dispatch/EraserDispatch';
import {FeruleDispatch} from './dispatch/FeruleDispatch';
import {LineDispatch} from './dispatch/LineDispatch';
import {PencilDispatch} from './dispatch/PencilDispatch';
import {RectDispatch} from './dispatch/RectDispatch';
import {SelectDispatch} from './dispatch/SelectDispatch';
import {StarDispatch} from './dispatch/StarDispatch';
import {ITextDispatch} from './dispatch/ITextDispatch';
import {TriangleDispatch} from './dispatch/TriangleDispatch';
import {UndoRedoDispatch} from './dispatch/UndoRedoDispatch';
import {EventList, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IBrushContext} from './interface/IBrush';
import {IBaseFrame, IMessage} from './interface/IFrame';
import './style/cursor.less';
import {MessageTag} from './enums/MessageTag';
import {Common} from './untils/Common';
import {Cursor} from './untils/Cursor';

fabric.Object.prototype.objectCaching = false;// disable cache


const _requestAnimFrame = function(callback:any) {
    return window.setTimeout(callback, 1000 / 60);
};

fabric.util.requestAnimFrame=function requestAnimFrame() {
    return _requestAnimFrame.apply(window, arguments);
};

// @ts-ignore
fabric.util.cancelAnimFrame= function cancelAnimFrame() {
    return window.clearTimeout.apply(window, arguments);
};



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
        borderScaleFactor:this.borderScaleFactor,
        text:this["text"],
        fontSize:this["fontSize"],
        fill:this.fill||null,
        radius:this["radius"],
        selectionStyleList:this["selectionStyleList"],
        editingBorderColor:this["editingBorderColor"],
        padding:this["padding"]
    });
};


export declare interface IEBoardCanvasContext extends IBrushContext{
    disabled:boolean;
    dispatchMessage:(message:IMessage,timestamp:number,animation?:boolean)=>Promise<{}>;
    setCacheData:(json:any,wbNumber:string,pageNo?:number)=>void;
    clearCacheMessage:(wbNumber:string,pageNo?:number)=>void;
    clearAll:(wbNumber:string,pageNo?:number)=>void;
    clearUndoRedo:()=>void;
}


declare interface IEBoardCanvasProps extends IEBoardCanvasContext{
    property:IBaseFrame;
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    }
    onContainerSizeChange:()=>void;
}




class EBoardCanvas extends React.Component<IEBoardCanvasProps>{
    private containerRef:RefObject<HTMLCanvasElement>=React.createRef();
    private fabricCanvas:Canvas;
    private image:HTMLImageElement;
    private imageWidth:number;
    private imageHeight:number;
    private bgObject:fabric.Image;
    private brush:any;
    
    
    public pencilDispatch:PencilDispatch;
    public textDispatch:ITextDispatch;
    public lineDispatch:LineDispatch;
    public arrowDispatch:ArrowDispatch;
    public circleDispatch:CircleDispatch;
    public rectDispatch:RectDispatch;
    public starDispatch:StarDispatch;
    public triangleDispatch:TriangleDispatch;
    public eraserDispatch:EraserDispatch;
    public transformDispatch:SelectDispatch;
    public feruleDispatch:FeruleDispatch;
    public undoRedoDispatch:UndoRedoDispatch;
    constructor(props:IEBoardCanvasProps) {
        super(props);
        this.initImage();
    }
    componentDidMount(): void {
        const container = this.containerRef.current;
        this.fabricCanvas=new Canvas(container,{
            selection:false,
            skipTargetFind:true,
            enableRetinaScaling:false,
            selectionBorderColor:this.props.config.borderColor,
            selectionLineWidth:this.props.config.borderWidth,
        });
        this.initBrush();
        this.initDispatch();
        this.dispatchListener();
        this.init();
    }
    componentWillReceiveProps(nextProps: Readonly<IEBoardCanvasProps>, nextContext: IEBoardContext): void {
        // 数据缓存
        if(this.props.property.wbNumber!==nextProps.property.wbNumber||this.props.property.pageNum!==nextProps.property.pageNum){
            this.destroy();
            this.forceUpdate(()=>{
                this.init();// 需要使用nextProps
            });
        }else if(nextProps.width!==this.props.width||nextProps.height!==this.props.height){
            this.forceUpdate(()=>{
                this.layout();
            });
        }
        if(JSON.stringify(this.props.config)!==JSON.stringify(nextProps.config)||this.props.disabled!==nextProps.disabled){
            this.forceUpdate(()=>{
                this.initBrush();
            });
        }
    }
    shouldComponentUpdate(nextProps: Readonly<IEBoardCanvasProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        return false;
    }
    componentDidUpdate(
        prevProps: Readonly<IEBoardCanvasProps>, prevState: Readonly<{}>,
        snapshot?: any): void {
        // 需要重新init
        // this.init();
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
        this.transformDispatch=null;
        this.feruleDispatch=null;
        this.undoRedoDispatch=null;
        this.unDispatchListener();
    }
    
    /**
     * 加载失败重试3次
     * @param initCount
     */
    @Bind
    private initImage(initCount=3){
        if(initCount===0){
            return;
        }
        const {property} = this.props;
        const {wbType,images,pageNum} = property;
        if(wbType===FRAME_TYPE_ENUM.IMAGES){
            if(initCount!==3){
                this.image.src=images[pageNum-1];
            }else{
                this.image=null;
                this.image=new Image();
                this.image.src=images[pageNum-1];
                this.image.onerror=()=>{
                    this.initImage(initCount-1);
                }
            }
        }else if(wbType===FRAME_TYPE_ENUM.IMAGE){
            if(initCount!==3){
                this.image.src=images[0];
            }else{
                this.image=null;
                this.image=new Image();
                this.image.src=images[0];
                this.image.onerror=()=>{
                    this.initImage(initCount-1);
                }
            }
        }
    }
    @Bind
    private init(){
        // cache restore
        this.fabricCanvas.clear();
        this.initImage();
        this.layout();
        const {property} = this.props;
        const {cacheJSON,cacheMessage,wbNumber,pageNum} = property;
        let promise=new Promise((resolve,reject)=>{
           if(cacheJSON){
               this.fabricCanvas.loadFromJSON(cacheJSON,()=>{
                   this.fabricCanvas.renderAll();
                   resolve();
               });
           }else{
               resolve();
           }
        });
        promise.then(()=>{
            if(cacheMessage){
                // 根据消息进行恢复
                let _promise=new Promise((resolve)=>resolve());
                cacheMessage.map((message:any)=>{
                    _promise.then(()=>{
                        return this.props.dispatchMessage(message,0,false);
                    });
                });
                _promise.then(()=>{
                    this.props.clearCacheMessage(wbNumber,pageNum);
                })
            }
        });
        // update brush
        this.brush&&this.brush.update(wbNumber,pageNum);
    }
    @Bind
    private destroy(){
        const {wbNumber,pageNum} = this.props.property;
        this.props.setCacheData(JSON.stringify(this.fabricCanvas),wbNumber,pageNum);
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
                this.props.onMessageListener({
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
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.pencilDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private textListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.textDispatch.onDraw(objectId,timestamp,attributes,animation);
        }
    }
    @Bind
    private lineListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.lineDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private arrowListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.arrowDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private circleListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.circleDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private rectListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.rectDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private starListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.starDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
        }
    }
    @Bind
    private triangleListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,objectId,attributes,timestamp,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.triangleDispatch.onDraw(objectId,timestamp,attributes,animation,wbNumber,pageNum);
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
    private transformListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum,attributes,animation} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.transformDispatch.onDraw(attributes,animation);
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
    private undoListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.undoRedoDispatch.undoAction(data);
        }
    }
    @Bind
    private redoListener(e:any){
        const data = e.data;
        const {wbNumber,pageNum} = data;
        const {property} = this.props;
        const {pageNum:currentPageNum} = property;
        if(wbNumber===property.wbNumber&&pageNum===currentPageNum){
            this.undoRedoDispatch.redoAction(data);
        }
    }
    @Bind
    private dispatchListener(){
        this.props.eventEmitter.on(EventList.Clear,this.clearListener);
        this.props.eventEmitter.on(EventList.DrawPencil, this.pencilListener);
        this.props.eventEmitter.on(EventList.DrawText, this.textListener);
        this.props.eventEmitter.on(EventList.DrawLine, this.lineListener);
        this.props.eventEmitter.on(EventList.DrawArrow, this.arrowListener);
        this.props.eventEmitter.on(EventList.DrawCircle, this.circleListener);
        this.props.eventEmitter.on(EventList.DrawRect, this.rectListener);
        this.props.eventEmitter.on(EventList.DrawStar, this.starListener);
        this.props.eventEmitter.on(EventList.DrawTriangle, this.triangleListener);
        this.props.eventEmitter.on(EventList.Delete, this.deleteListener);
        this.props.eventEmitter.on(EventList.Transform, this.transformListener);
        this.props.eventEmitter.on(EventList.Ferule,this.feruleListener);
        this.props.eventEmitter.on(EventList.Undo,this.undoListener);
        this.props.eventEmitter.on(EventList.Redo,this.redoListener);
    }
    @Bind
    private unDispatchListener(){
        this.props.eventEmitter.off(EventList.Clear,this.clearListener);
        this.props.eventEmitter.off(EventList.DrawPencil, this.pencilListener);
        this.props.eventEmitter.off(EventList.DrawText, this.textListener);
        this.props.eventEmitter.off(EventList.DrawLine, this.lineListener);
        this.props.eventEmitter.off(EventList.DrawArrow, this.arrowListener);
        this.props.eventEmitter.off(EventList.DrawCircle, this.circleListener);
        this.props.eventEmitter.off(EventList.DrawRect, this.rectListener);
        this.props.eventEmitter.off(EventList.DrawStar, this.starListener);
        this.props.eventEmitter.off(EventList.DrawTriangle, this.triangleListener);
        this.props.eventEmitter.off(EventList.Delete, this.deleteListener);
        this.props.eventEmitter.off(EventList.Transform, this.transformListener);
        this.props.eventEmitter.off(EventList.Ferule,this.feruleListener);
        this.props.eventEmitter.off(EventList.Undo,this.undoListener);
        this.props.eventEmitter.off(EventList.Redo,this.redoListener);
    }
    @Bind
    private layout(){
        let {width:canvasWidth,height:canvasHeight,property,dimensions:_dimensions} = this.props;
        const dimensions = Object.assign({},_dimensions);
        const {wbType} = property;
        if(!this.fabricCanvas){return}
        switch (wbType) {
            case FRAME_TYPE_ENUM.EMPTY:
                this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasHeight});// 设置样式大小
                this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                this.props.onContainerSizeChange();
                break;
            case FRAME_TYPE_ENUM.IMAGES:
            case FRAME_TYPE_ENUM.PDF:
            case FRAME_TYPE_ENUM.IMAGE:
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
                    if(layoutMode==="top_auto"||void 0 === layoutMode){
                        // scroll enable
                        const imageRatio = this.imageHeight/this.imageWidth;
                        if(height/width<imageRatio){
                            dimensions.height=dimensions.width*imageRatio;
                            this.fabricCanvas.setDimensions({width:canvasWidth,height:canvasWidth*imageRatio});// 设置样式大小
                            this.fabricCanvas.setDimensions(dimensions,{backstoreOnly:true});// 设置canvas 画布大小
                            this.props.onContainerSizeChange();
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
                    this.props.onContainerSizeChange();
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
    private getBrushContext():IBrushContext{
        // 获取brushContext
        const {idGenerator,config,eventEmitter,onMessageListener,pushUndoStack} = this.props;
        return {
            idGenerator,
            config,
            eventEmitter,
            onMessageListener,
            pushUndoStack
        }
    }
    
    
    @Bind
    private initBrush(){
        const {config,disabled} = this.props;
        const {toolType,shapeType,pickedColor,pencilWidth,strokeWidth,fontSize} = config;
        const {property} = this.props;
        const {wbNumber,pageNum} = property as any;
        if(this.brush&&this.brush.destroy){
            this.brush.destroy();
            this.brush=null;
        }
      
        this.fabricCanvas.freeDrawingBrush=null;
        this.fabricCanvas.freeDrawingCursor=null;
        this.fabricCanvas.hoverCursor=null;
        this.fabricCanvas.defaultCursor=Cursor.default;
    
        if(disabled){
            return;
        }
        
        const brushContext = this.getBrushContext();
        switch (toolType) {
            case TOOL_TYPE.Select:
                this.fabricCanvas.isDrawingMode=false;
                this.fabricCanvas.setCursor(Cursor.default);
                this.fabricCanvas.defaultCursor=Cursor.default;
                this.brush = new SelectBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                break;
            case TOOL_TYPE.Pencil:
                this.fabricCanvas.isDrawingMode=true;
                this.brush = new PencilBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                this.fabricCanvas.freeDrawingCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                this.brush.width=pencilWidth;
                this.brush.color=pickedColor;
                this.fabricCanvas.freeDrawingBrush = this.brush;
                break;
            case TOOL_TYPE.Text:
                this.fabricCanvas.isDrawingMode=false;
                this.brush = new ITextBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                this.fabricCanvas.defaultCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                this.brush.fontSize = fontSize;
                this.brush.fontColor = pickedColor;
                break;
            case TOOL_TYPE.Shape:
                switch (shapeType) {
                    case SHAPE_TYPE.Arrow:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new ArrowBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.width=strokeWidth;
                        this.brush.stroke=pickedColor;
                        this.brush.fill=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Line:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new LineBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.width=strokeWidth;
                        this.brush.stroke=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Circle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new CircleBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowCircle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new CircleBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=pickedColor;
                        this.brush.width=strokeWidth;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Star:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new StarBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowStar:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new StarBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=pickedColor;
                        this.brush.width=strokeWidth;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Triangle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new TriangleBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowTriangle:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new TriangleBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.Rect:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new RectBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.fill=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                    case SHAPE_TYPE.HollowRect:
                        this.fabricCanvas.isDrawingMode=true;
                        this.brush = new RectBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                        this.fabricCanvas.freeDrawingCursor=this.brush.cursorType||Cursor.cross;
                        this.fabricCanvas.setCursor(this.brush.cursorType||Cursor.cross);
                        this.brush.stroke=pickedColor;
                        this.fabricCanvas.freeDrawingBrush = this.brush;
                        break;
                }
                break;
            case TOOL_TYPE.Eraser:
                this.fabricCanvas.isDrawingMode=false;
                this.brush = new EraserBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                this.fabricCanvas.defaultCursor=this.brush.cursorType;
                this.fabricCanvas.hoverCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                break;
            case TOOL_TYPE.Ferule:
                this.fabricCanvas.isDrawingMode=false;
                this.brush = new FeruleBrush(this.fabricCanvas,brushContext,wbNumber,pageNum);
                this.fabricCanvas.defaultCursor=this.brush.cursorType;
                this.fabricCanvas.setCursor(this.brush.cursorType);
                break;
        }
    }
    private clear(){
        // 当前的
        const {property} = this.props;
        this.fabricCanvas.clear();
        this.props.clearAll(property.wbNumber,property.pageNum);
        this.props.clearUndoRedo();// 清空同时清空undoRedo列表
        // 背景图需要保留
        if(this.bgObject){
            this.fabricCanvas.backgroundImage=this.bgObject;
        }
    }
    @Bind
    private initDispatch(){
        const brushContext = this.getBrushContext();
        this.pencilDispatch=new PencilDispatch(this.fabricCanvas,brushContext,this);
        this.textDispatch=new ITextDispatch(this.fabricCanvas,brushContext);
        this.lineDispatch=new LineDispatch(this.fabricCanvas,brushContext,this);
        this.arrowDispatch=new ArrowDispatch(this.fabricCanvas,brushContext,this);
        this.circleDispatch=new CircleDispatch(this.fabricCanvas,brushContext,this);
        this.rectDispatch=new RectDispatch(this.fabricCanvas,brushContext,this);
        this.starDispatch=new StarDispatch(this.fabricCanvas,brushContext,this);
        this.triangleDispatch=new TriangleDispatch(this.fabricCanvas,brushContext,this);
        this.eraserDispatch=new EraserDispatch(this.fabricCanvas,brushContext);
        this.transformDispatch=new SelectDispatch(this.fabricCanvas,brushContext);
        this.feruleDispatch=new FeruleDispatch(this.fabricCanvas,brushContext);
        this.undoRedoDispatch=new UndoRedoDispatch(this.fabricCanvas,brushContext,this);
    }
    render(){
        return (
            <canvas key="rc_eboard_canvas" ref={this.containerRef}/>
        )
    }
}









export {EBoardCanvas};