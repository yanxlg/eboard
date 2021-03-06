/**
 * @disc:Tool
 * @author:yanxinaliang
 * @time：2019/4/6 19:22
 */
import {Bind} from 'lodash-decorators';
import React, {MouseEvent} from 'react';
import {SHAPE_TYPE, TOOL_TYPE} from './Config';
import {EBoardContext, EventList, IEBoardContext} from './EBoardContext';
import './font/iconfont.css';
import './style/tool.less';

declare interface IEBoardToolState {
    shapeType?:string;
    left?:number;
    top?:number;
    showPanel:boolean;
    type?:"pencil"|"text"|"shape"|"color"
}




class EBoardTool extends React.Component<{},IEBoardToolState>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    private colors:string[]=[
        "#ffffff",
        "#888888",
        "#555555",
        "#000000",
        "#f22500",
        "#f66c00",
        "#fad500",
        "#64cb00",
        "#00cac4",
        "#3698f3",
        "#8b6dc5",
        "#ff7c81"
    ];
    private pencilDotSize:number[]=[2,4,8,12];
    private fontSize:number[]=[14,18,24,26];
    constructor(props:{}){
        super(props);
        this.state={
            showPanel:false,
        }
    }
    @Bind
    private onClick(e:MouseEvent<HTMLButtonElement|HTMLDivElement>){
        const label = e.currentTarget.title;
        switch (label) {
            case "选择":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Select
                });
                break;
            case "画笔":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Pencil
                });
                break;
            case "图形":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape
                });
                break;
            case "文字":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Text
                });
                break;
            case "直线":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Line
                });
                break;
            case "实心圆":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Circle
                });
                break;
            case "实心星":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Star
                });
                break;
            case "实心三角":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Triangle
                });
                break;
            case "实心方形":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Rect
                });
                break;
            case "箭头":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.Arrow
                });
                break;
            case "空心圆":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.HollowCircle
                });
                break;
            case "空心星":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.HollowStar
                });
                break;
            case "空心三角":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.HollowTriangle
                });
                break;
            case "空心方形":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Shape,
                    shapeType:SHAPE_TYPE.HollowRect
                });
                break;
            case "橡皮擦":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Eraser
                });
                break;
            case "清空":
                const {eventEmitter} = this.context;
                const frame = this.context.getActiveBoard();
                if(frame){
                    const {wbNumber,pageNum} = frame;
                    eventEmitter.trigger(EventList.Clear,{
                        wbNumber,
                        pageNum,
                        evented:true
                    });
                }
                break;
            case "教鞭":
                this.context.setToolProps({
                    toolType:TOOL_TYPE.Ferule
                });
                break;
            case "撤销":
                this.context.undo();
                break;
            case "反撤销":
                this.context.redo();
                break;
        }
    }
    @Bind
    private showPanel(e:MouseEvent<HTMLButtonElement>){
        const element = e.currentTarget;
        const {offsetLeft,offsetTop,offsetHeight,title} = element;
        if(/画笔|文字|图形|颜色/.test(title)){
            this.setState({
                showPanel:true,
                left:offsetLeft,
                top:offsetTop+offsetHeight,
                type:title==="画笔"?"pencil":title==="文字"?"text":title==="颜色"?"color":"shape"
            })
        }else{
            this.setState({
                showPanel:false,
            })
        }
    }
    @Bind
    private hidePanel(){
        this.setState({
            showPanel:false
        })
    }
    @Bind
    private setPencilWidth(e:MouseEvent<HTMLDivElement>){
        const element = e.currentTarget;
        const size = parseInt(element.getAttribute("data-size"),10);
        this.context.setToolProps({
            pencilWidth:size,
            toolType:TOOL_TYPE.Pencil
        });
    }
    @Bind
    private setFontSize(e:MouseEvent<HTMLDivElement>){
        const element = e.currentTarget;
        const size = parseInt(element.getAttribute("data-size"),10);
        this.context.setToolProps({
            fontSize:size,
            toolType:TOOL_TYPE.Text
        });
        this.context.eventEmitter.trigger(EventList.FontSizeChange,{fontSize:size});
    }
    @Bind
    private setColor(e:MouseEvent<HTMLDivElement>){
        const element = e.currentTarget;
        const color = element.getAttribute("data-color");
        this.context.eventEmitter.trigger(EventList.ColorChange,{fill:color});
        this.context.setToolProps({
            pickedColor:color
        });
    }
    render(){
        const {showPanel,left,top,type} = this.state;
        const {config} = this.context;
        const {pickedColor,fontSize,toolType,pencilWidth,shapeType} = config;
        const {activeWbNumber,docPageNumMap} = this.context;
        const pageNum = docPageNumMap.get(activeWbNumber);
        const undoStack = this.context.getUndoStack(activeWbNumber,pageNum);
        const redoStack = this.context.getRedoStack(activeWbNumber,pageNum);
        return (
            <div className="board-tool">
                <div className="board-tool-wrap" onMouseLeave={this.hidePanel}>
                    <button className={`board-tool-item eboard-icon eboard-icon-xuanze ${toolType===TOOL_TYPE.Select?"active":""}`} onClick={this.onClick} title={"选择"} onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-huabi ${toolType===TOOL_TYPE.Pencil?"active":""}`} onClick={this.onClick} title="画笔" onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-wenzi ${toolType===TOOL_TYPE.Text?"active":""}`} onClick={this.onClick} title="文字" onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-tuxing ${toolType===TOOL_TYPE.Shape?"active":""}`} title="图形" onClick={this.onClick} onMouseEnter={this.showPanel}/>
                    <button className="board-tool-item eboard-icon eboard-icon-colour" title="颜色" onMouseEnter={this.showPanel} style={{color:pickedColor}}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-rubber ${toolType===TOOL_TYPE.Eraser?" active":""}`} onClick={this.onClick} title="橡皮擦" onMouseEnter={this.showPanel}/>
                    <button className="board-tool-item eboard-icon eboard-icon-qingkong" onClick={this.onClick} title="清空" onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-jiaobian ${toolType===TOOL_TYPE.Ferule?" active":""}`} onClick={this.onClick} title="教鞭" onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-revoke ${undoStack&&undoStack.length>0?"":"disabled"}`} onClick={this.onClick} title="撤销" onMouseEnter={this.showPanel}/>
                    <button className={`board-tool-item eboard-icon eboard-icon-redo ${redoStack&&redoStack.length>0?"":"disabled"}`} onClick={this.onClick} title="反撤销" onMouseEnter={this.showPanel}/>
                    <div className={`board-tool-panel ${showPanel?"board-tool-panel-show":""}`} style={{left,top}}>
                        {
                            type==="pencil"?(
                                <div className="board-tool-panel-header">
                                    {
                                        this.pencilDotSize.map((size:number)=>{
                                            return (
                                                <div key={size} className="board-tool-panel-item board-tool-panel-item-pointer" data-size={size} onClick={this.setPencilWidth}>
                                                    <div className={`board-tool-panel-dot ${pencilWidth===size?"active":""}`} style={{width:size,height:size}}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ):type==="text"?(
                                <div className="board-tool-panel-header">
                                    {
                                        this.fontSize.map((size:number)=>{
                                            return (
                                                <div key={size} className="board-tool-panel-item" data-size={size} onClick={this.setFontSize}>
                                                    <div className={`board-tool-panel-font ${fontSize===size?"active":""}`}>{size}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ):type==="color"?(
                                <div className="board-tool-panel-body">
                                    {
                                        this.colors.map((color)=>{
                                            return (
                                                <div key={color} className={`board-tool-panel-color ${pickedColor===color?"active":""}`} data-color={color} onClick={this.setColor}>
                                                    <div className="board-tool-panel-color-inner" style={{backgroundColor:color}}/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ):(
                                <React.Fragment>
                                    <div className="board-tool-panel-header board-tool-panel-sub">
                                        <div className="board-tool-panel-item" >
                                            <div title="直线" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-zhixian ${shapeType===SHAPE_TYPE.Line?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="实心圆" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-shixinyuan ${shapeType===SHAPE_TYPE.Circle?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="实心星" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-shixinxing ${shapeType===SHAPE_TYPE.Star?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="实心三角" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-shixinsanjiao ${shapeType===SHAPE_TYPE.Triangle?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="实心方形" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-shixinfangxing ${shapeType===SHAPE_TYPE.Rect?"active":""}`}/>
                                        </div>
                                    </div>
                                    <div className="board-tool-panel-header">
                                        <div className="board-tool-panel-item" >
                                            <div title="箭头" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-jiantou ${shapeType===SHAPE_TYPE.Arrow?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="空心圆" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-kongxinyuan ${shapeType===SHAPE_TYPE.HollowCircle?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="空心星" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-kongxinxing ${shapeType===SHAPE_TYPE.HollowStar?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="空心三角" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-kongxinsanjiao ${shapeType===SHAPE_TYPE.HollowTriangle?"active":""}`}/>
                                        </div>
                                        <div className="board-tool-panel-item">
                                            <div title="空心方形" onClick={this.onClick} className={`board-tool-panel-shape eboard-icon eboard-icon-kongxinfangxing ${shapeType===SHAPE_TYPE.HollowRect?"active":""}`}/>
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export {EBoardTool};