/**
 * @disc:Context状态管理
 * @author:yanxinaliang
 * @time：2019/3/30 14:28
 */
import {Bind} from "lodash-decorators";
import React from "react";
import {Config,IConfig} from './Config';
import {FRAME_TYPE_ENUM} from "./enums/EBoardEnum";
import {IEmptyFrame, IFrame, IImageFrame} from "./interface/IFrame";
import {EMap} from "./untils/Map";

export declare interface IEBoardContext{
    lock:boolean;
    config:IConfig;
    activeBoard?:string;
    boardMap:EMap<string,IFrame>
}

const Context=React.createContext(null);

class EBoardContext extends React.PureComponent<{},IEBoardContext>{
    public static Context=Context;
    public static Provider=Context.Provider;
    public static Consumer=Context.Consumer;
    public static getBoardList:()=>IFrame[];
    public static updateBoardMap:(boards:EMap<string,IFrame>,activeBoard:string)=>void;
    public static updateActiveBoard:(wbNumber:string)=>void;
    constructor(props:{}){
        super(props);
        const boardMap = new EMap<string,IFrame>();
        const frame:IEmptyFrame= {type:FRAME_TYPE_ENUM.EMPTY,wbNumber:"111",name:"白板"};
        const frame1:IEmptyFrame= {type:FRAME_TYPE_ENUM.EMPTY,wbNumber:"222",name:"白板"};
        const frame2:IEmptyFrame= {type:FRAME_TYPE_ENUM.EMPTY,wbNumber:"333",name:"白板"};
        const frame3:IImageFrame= {type:FRAME_TYPE_ENUM.IMAGE,wbNumber:"444",name:"图片",image:"http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg",imageWidth:150,imageHeight:100};
        boardMap.set("111",frame);
        boardMap.set("222",frame1);
        boardMap.set("333",frame2);
        boardMap.set("444",frame3);
        this.state={
            activeBoard:"444",
            boardMap,
            config:Config,
            lock:false
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
    private updateBoardMap(boards:EMap<string,IFrame>,activeBoard:string){
        this.setState({
            activeBoard,
            boardMap:boards.clone()
        })
    }
    @Bind
    private updateActiveBoard(wbNumber:string){
        this.setState({
            activeBoard:wbNumber
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