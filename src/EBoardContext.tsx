/**
 * @disc:Context状态管理
 * @author:yanxinaliang
 * @time：2019/3/30 14:28
 */
import {Bind} from "lodash-decorators";
import React from "react";
import {Config,IConfig} from './Config';
import {ArrowBrush} from './derived/ArrowBrush';
import {CircleBrush} from './derived/CircleBrush';
import {EllipseBrush} from './derived/EllipseBrush';
import {LineBrush} from './derived/LineBrush';
import {PencilBrush} from './derived/PencilBrush';
import {RectBrush} from './derived/RectBrush';
import {SquareBrush} from './derived/SquareBrush';
import {StarBrush} from './derived/StarBrush';
import {IFrame} from "./interface/IFrame";
import {EventEmitter} from './untils/EventMitter';
import {IDGenerator} from './untils/IDGenerator';
import {EMap} from "./untils/Map";


type BrushClassType = typeof PencilBrush|typeof LineBrush|typeof ArrowBrush|typeof CircleBrush|typeof EllipseBrush|typeof RectBrush|typeof SquareBrush|typeof StarBrush;


export declare interface IEBoardContext{
    lock:boolean;
    config:IConfig;
    activeBoard?:string;
    boardMap:EMap<string,IFrame>,
    eventEmitter:EventEmitter<EventList>;
    idGenerator:IDGenerator;
    brush?:BrushClassType;
    brushOptions?:any;
    setBrush:(brushClass:BrushClassType,brushOptions?:any)=>void;
    updateBoardMap:(boards:EMap<string,IFrame>)=>void;
}

const Context=React.createContext(null);

export enum EventList {
    Resize="resize",
}


class EBoardContext extends React.PureComponent<{},IEBoardContext>{
    public static Context=Context;
    public static Provider=Context.Provider;
    public static Consumer=Context.Consumer;
    public static getBoardList:()=>IFrame[];
    public static updateBoardMap:(boards:EMap<string,IFrame>,activeBoard:string)=>void;
    public static updateActiveBoard:(wbNumber:string)=>void;
    public eventEmitter:EventEmitter<EventList>=new EventEmitter<EventList>();
    public idGenerator:IDGenerator = new IDGenerator(111,"ds");
    constructor(props:{}){
        super(props);
        const boardMap = new EMap<string,IFrame>();
       
    
 /*       const map1 = new Map<number,IImageFrame>();
        map1.set(1,{
            type:FRAME_TYPE_ENUM.IMAGE,
            wbNumber:"444",
            name:"图片",
            image:"http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg",
            imageWidth:150,
            imageHeight:100
        });
        
        boardMap.set("1",{
            type:FRAME_TYPE_ENUM.IMAGES,
            name:"images",
            wbNumber:"1",
            children:map,
            pageNo:1,
        });
        boardMap.set("12",{
            type:FRAME_TYPE_ENUM.PDF,
            name:"pdf",
            wbNumber:"12",
            children:map1,
            pageNo:1,
        });*/
        this.state={
            activeBoard:"444",
            boardMap,
            config:Config,
            lock:false,
            eventEmitter:this.eventEmitter,
            idGenerator:this.idGenerator,
            setBrush:this.setBrush,
            updateBoardMap:this.updateBoardMap
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
    private setBrush(brush:BrushClassType,brushOptions?:any){
        this.setState({
            brush,
            brushOptions
        })
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