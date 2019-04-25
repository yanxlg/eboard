/**
 * @disc:Context状态管理
 * @author:yanxinaliang
 * @time：2019/3/30 14:28
 */
import {Bind} from 'lodash-decorators';
import React from 'react';
import {config, IConfig, SHAPE_TYPE, TOOL_TYPE} from './Config';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {
    IBaseFrame,
    IMessage,
} from './interface/IFrame';
import {MessageTag} from './static/MessageTag';
import {EventEmitter} from './untils/EventMitter';
import {IDGenerator} from './untils/IDGenerator';
import {EMap} from './untils/Map';

export declare interface IEBoardContext{
    lock:boolean;
    config:IConfig;
    activeWbNumber?:string;
    docPageNumMap:EMap<string,number>;
    boardMap:EMap<string,IBaseFrame>,
    eventEmitter:EventEmitter<EventList>;
    idGenerator:IDGenerator;
    brushOptions?:any;
    addBoard:(frame:IBaseFrame,wbNumber:string,pageNum?:number)=>void;
    removeBoard:(wbNumber:string,pageNum?:number)=>void;
    setToolProps:(props:IToolProps)=>void;
    onMessageListener:(message:object)=>void;
    updateActiveWbNumber:(wbNumber:string,pageNum?:number)=>void;
    setCacheData:(json:any,wbNumber:string,pageNo?:number)=>void;
    getActiveBoard:()=>IBaseFrame|undefined;
    hasBoard:(wbNumber:string,pageNum?:number)=>boolean;
    updateVScrollOffset:(vScrollOffset:number,webNumber:string,pageNum?:number)=>void;
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
    DrawTriangle="drawTriangle",
    Transform="transform",
    Scroll="scroll",
    Delete="delete",
    Ferule="ferule"
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
    public eventEmitter:EventEmitter<EventList>=new EventEmitter<EventList>();
    public idGenerator:IDGenerator = new IDGenerator(111,"ds");
    private imageListMap:Map<string,string[]>=new Map();
    constructor(props:IEboardContextProps){
        super(props);
        const boardMap = new EMap<string,IBaseFrame>();
        this.state={
            boardMap,
            docPageNumMap:new EMap<string, number>(),
            config,
            lock:false,
            eventEmitter:this.eventEmitter,
            idGenerator:this.idGenerator,
            addBoard:this.addBoard,
            removeBoard:this.removeBoard,
            setToolProps:this.setToolProps,
            onMessageListener:props.onMessageListener,
            updateActiveWbNumber:this.updateActiveWbNumber,
            setCacheData:this.setCacheData,
            getActiveBoard:this.getActiveBoard,
            hasBoard:this.hasBoard,
            updateVScrollOffset:this.updateVScrollOffset
        };
    }
    @Bind
    private updateVScrollOffset(vScrollOffset:number,wbNumber:string,pageNum?:number){
        const board = this.getBoard(wbNumber,pageNum);
        board.vScrollOffset=vScrollOffset;
    }
    @Bind
    private hasBoard(wbNumber:string,pageNum?:number){
        const key = this.getKey(wbNumber,pageNum);
        const {boardMap} = this.state;
        return boardMap.has(key);
    }
    @Bind
    private getBoard(wbNumber:string,pageNum?:number){
        const {boardMap} = this.state;
        return boardMap.get(this.getKey(wbNumber,pageNum));
    }
    @Bind
    private getActiveBoard(){
        const {activeWbNumber,docPageNumMap,boardMap} = this.state;
        if(void 0 === activeWbNumber){
            return undefined;
        }
        if(docPageNumMap.has(activeWbNumber)){
            return boardMap.get(this.getKey(activeWbNumber,docPageNumMap.get(activeWbNumber)));
        }else{
            return boardMap.get(this.getKey(activeWbNumber));
        }
    }
    @Bind
    private getKey(wbNumber:string,pageNum?:number){
        return JSON.stringify({
            wbNumber,
            pageNum
        })
    }
    @Bind
    private setCacheData(json:any,wbNumber:string,pageNum?:number){
        const {boardMap} = this.state;
        const board = boardMap.get(this.getKey(wbNumber,pageNum));
        board&&(board.cacheJSON=json);
    }
    @Bind
    public addBoard(frame:IBaseFrame,wbNumber:string,pageNum?:number){
        const {boardMap} = this.state;
        const nextBoardMap = boardMap.clone();
        nextBoardMap.set(this.getKey(wbNumber,pageNum),frame);
        this.setState({
            boardMap:nextBoardMap
        });
        if(frame.imageArray){
            console.log(frame.imageArray);
            this.imageListMap.set(wbNumber,frame.imageArray);
        }
    }
    @Bind
    private removeBoard(wbNumber:string,pageNum?:number){
        const {boardMap} = this.state;
        const nextBoardMap = boardMap.clone();
        if(void 0 === pageNum){
            nextBoardMap.forEach((board,key)=>{
                if(board.wbNumber===wbNumber){
                    nextBoardMap.delete(key);
                }
            });
        }else{
            nextBoardMap.delete(this.getKey(wbNumber,pageNum));
        }
        this.setState({
            boardMap:nextBoardMap
        });
        if(this.imageListMap.has(wbNumber)){
            this.imageListMap.delete(wbNumber);
        }
    }
    @Bind
    public updateActiveWbNumber(wbNumber:string,pageNum?:number){
        if(void 0 === pageNum){
            this.setState({
                activeWbNumber:wbNumber
            })
        }else{
            const {docPageNumMap} = this.state;
            const clone = docPageNumMap.clone();
            clone.set(wbNumber,pageNum);
            this.setState({
                activeWbNumber:wbNumber,
                docPageNumMap:clone
            })
        }
    }
    @Bind
    private setToolProps(props:IToolProps){
        this.setState({
            config:Object.assign({},this.state.config,props)
        })
    }
    @Bind
    public dispatchMessage(message:IMessage,timestamp:number){
        const {tag,wbNumber,pageNum,shapeType,objectId,attributes,wbType,canRemove,wbName,wbIcon,vScrollOffset,objectIds,imageArray,layoutMode} = message;
        switch (tag) {
            case MessageTag.CreateFrame:
                this.addBoard({
                    wbNumber,
                    wbType,
                    canRemove,
                    wbName,
                    wbIcon
                },wbNumber,pageNum);
                this.updateActiveWbNumber(wbNumber,pageNum);
                break;
            case MessageTag.CreateFrameGroup:
                this.addBoard({
                    wbType,
                    wbNumber,
                    imageArray,
                    layoutMode,
                    wbName,
                    pageNum
                },wbNumber,pageNum);
                this.updateActiveWbNumber(wbNumber,pageNum);
                break;
            case MessageTag.SwitchToFrame:
                this.setState({
                    activeWbNumber:wbNumber
                });
                break;
            case MessageTag.TurnPage:
                // 需要判断当前是否存在
                if(this.hasBoard(wbNumber,pageNum)){
                    this.updateActiveWbNumber(wbNumber,pageNum);
                }else{
                    this.addBoard({
                        wbType:FRAME_TYPE_ENUM.IMAGES,
                        wbNumber,
                        layoutMode:"top_auto",
                        pageNum,
                        imageArray:this.imageListMap.get(wbNumber)||[],
                        missTab:true,
                    },wbNumber,pageNum);
                    this.updateActiveWbNumber(wbNumber,pageNum);
                }
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
                        this.state.eventEmitter.trigger(EventList.DrawTriangle,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
                        break;
                    case SHAPE_TYPE.HollowTriangle:
                        this.state.eventEmitter.trigger(EventList.DrawTriangle,{
                            wbNumber,
                            pageNum,
                            objectId,
                            attributes,
                            timestamp
                        });
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
            case MessageTag.Scroll:
                this.state.eventEmitter.trigger(EventList.Scroll,{
                    wbNumber,
                    pageNum,
                    timestamp,
                    vScrollOffset
                });
                break;
            case MessageTag.Delete:
                this.state.eventEmitter.trigger(EventList.Delete,{
                    wbNumber,
                    pageNum,
                    timestamp,
                    objectIds
                });
                break;
            case MessageTag.Cursor:
                this.state.eventEmitter.trigger(EventList.Ferule,{
                    wbNumber,
                    pageNum,
                    timestamp,
                    attributes
                });
                break;
            case MessageTag.RemoveFrame:
                this.removeBoard(wbNumber);
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