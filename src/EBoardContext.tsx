/**
 * @disc:Context状态管理
 * @author:yanxinaliang
 * @time：2019/3/30 14:28
 */
import {Bind} from 'lodash-decorators';
import React from 'react';
import {config, IConfig, SHAPE_TYPE, TOOL_TYPE} from './Config';
import {IFrame, IMessage} from './interface/IFrame';
import {MessageTag} from './static/MessageTag';
import {EventEmitter} from './untils/EventMitter';
import {IDGenerator} from './untils/IDGenerator';
import {EMap} from './untils/Map';

export declare interface IEBoardContext{
    lock:boolean;
    config:IConfig;
    activeBoard?:string;
    boardMap:EMap<string,IFrame>,
    eventEmitter:EventEmitter<EventList>;
    idGenerator:IDGenerator;
    brushOptions?:any;
    updateBoardMap:(boards:EMap<string,IFrame>)=>void;
    setToolProps:(props:IToolProps)=>void;
    onMessageListener:(message:object)=>void;
}

const Context=React.createContext(null);

export enum EventList {
    Resize="resize",
    Clear="clear",
    DrawPencil="drawPencil",
    DrawText="drawText",
    DrawLine="drawLine",
    DrawArrow="drawArrow",
    DrawCircle="drawCircle",
    DrawRect="drawRect",
    DrawStar="drawStar",
    Transform="transform"
}

declare interface IToolProps {
    toolType?:TOOL_TYPE;
    shapeType?:SHAPE_TYPE;
    pencilWidth?:number;
    pencilColor?:string;
    shapeColor?:string;
    fontSize?:number;
    fontColor?:string;
}

declare interface IEboardContextProps {
    onMessageListener:(message:object)=>void;
}

class EBoardContext extends React.PureComponent<IEboardContextProps,IEBoardContext>{
    public static Context=Context;
    public static Provider=Context.Provider;
    public static Consumer=Context.Consumer;
    public static getBoardList:()=>IFrame[];
    public static updateBoardMap:(boards:EMap<string,IFrame>,activeBoard:string)=>void;
    public static updateActiveBoard:(wbNumber:string)=>void;
    public eventEmitter:EventEmitter<EventList>=new EventEmitter<EventList>();
    public idGenerator:IDGenerator = new IDGenerator(111,"ds");
    constructor(props:IEboardContextProps){
        super(props);
        const boardMap = new EMap<string,IFrame>();
        this.state={
            activeBoard:"444",
            boardMap,
            config:config,
            lock:false,
            eventEmitter:this.eventEmitter,
            idGenerator:this.idGenerator,
            updateBoardMap:this.updateBoardMap,
            setToolProps:this.setToolProps,
            onMessageListener:props.onMessageListener
        };
        EBoardContext.getBoardList=this.getBoardList;
        EBoardContext.updateBoardMap=this.updateBoardMap;
        EBoardContext.updateActiveBoard=this.updateActiveBoard;
    }
    @Bind
    private getBoardList(){
        return this.state.boardMap.toArray();
    }
    @Bind
    private updateBoardMap(boards:EMap<string,IFrame>,activeBoard?:string){
        this.setState({
            activeBoard:activeBoard||this.state.activeBoard,
            boardMap:boards.clone()
        })
    }
    @Bind
    private updateActiveBoard(wbNumber:string){
        this.setState({
            activeBoard:wbNumber
        })
    }
    @Bind
    private setToolProps(props:IToolProps){
        this.setState({
            config:Object.assign({},this.state.config,props)
        })
    }
    @Bind
    public dispatchMessage(message:IMessage,timestamp:number){
        const {tag,wbNumber,pageNum,shapeType,objectId,attributes,wbType,canRemove,wbName,wbIcon} = message;
        switch (tag) {
            case MessageTag.CreateFrame:
                const {boardMap} = this.state;
                boardMap.set(wbNumber,{
                    wbNumber,
                    wbType,
                    canRemove,
                    wbName,
                    wbIcon
                });
                this.updateBoardMap(boardMap,wbNumber);// 默认切换到当前的
                break;
            case MessageTag.Shape:
                switch (shapeType) {
                    case TOOL_TYPE.Pencil:
                        this.state.eventEmitter.trigger(EventList.DrawPencil,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case TOOL_TYPE.Text:
                        this.state.eventEmitter.trigger(EventList.DrawText,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Line:
                        this.state.eventEmitter.trigger(EventList.DrawLine,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Arrow:
                        this.state.eventEmitter.trigger(EventList.DrawArrow,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Circle:
                        this.state.eventEmitter.trigger(EventList.DrawCircle,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.HollowCircle:
                        this.state.eventEmitter.trigger(EventList.DrawCircle,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Rect:
                        this.state.eventEmitter.trigger(EventList.DrawRect,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.HollowRect:
                        this.state.eventEmitter.trigger(EventList.DrawRect,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Star:
                        this.state.eventEmitter.trigger(EventList.DrawStar,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.HollowStar:
                        this.state.eventEmitter.trigger(EventList.DrawStar,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.Triangle:
                        break;
                    case SHAPE_TYPE.HollowTriangle:
                        break;
                }
                break;
            case MessageTag.Clear:
                this.state.eventEmitter.trigger(EventList.Clear,{
                    wbNumber,
                    pageNum,
                });
                break;
            case MessageTag.SelectionMove:
            case MessageTag.SelectionScale:
            case MessageTag.SelectionRotate:
                this.state.eventEmitter.trigger(EventList.Transform,{
                    wbNumber,
                    pageNum,
                    objectId,
                    attributes,
                    timestamp
                });
                break;
        }
    }
    render(){
        return (
            <Context.Provider value={this.state}>
                <Context.Consumer>
                    {
                        (context)=>this.props.children
                    }
                </Context.Consumer>
            </Context.Provider>
        );
    }
}

export {EBoardContext};