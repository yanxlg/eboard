/**
 * @disc:Context状态管理
 * @author:yanxinaliang
 * @time：2019/3/30 14:28
 */
import React from "react";
import {Config,IConfig} from './Config';

export declare interface IEBoardContext{
    lock:boolean;
    config:IConfig;
    activeBoard?:string;
    boardMap:Map<string,IFrame|IImageFrame>
}

const Context=React.createContext(null);

class EBoardContext extends React.PureComponent<{},IEBoardContext>{
    public static Context=Context;
    public static Provider=Context.Provider;
    public static Consumer=Context.Consumer;
    constructor(props:{}){
        super(props);
        const boardMap = new Map<string,IFrame|IImageFrame>();
        const frame:IFrame= {type:"empty",id:"111"};
        const frame1:IFrame= {type:"empty",id:"222"};
        const frame2:IFrame= {type:"empty",id:"333"};
        const frame3:IImageFrame= {type:"image",id:"444",image:"http://pic15.nipic.com/20110628/1369025_192645024000_2.jpg"};
        boardMap.set("111",frame);
        boardMap.set("222",frame1);
        boardMap.set("333",frame2);
        boardMap.set("444",frame3);
        this.state={
            activeBoard:"444",
            boardMap,
            config:Config,
            lock:false
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