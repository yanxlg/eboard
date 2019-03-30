/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 17:48
 */

import React from "react";
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {FRAME_TYPE_ENUM} from "./enums/EBoardEnum";
import {EmptyFrame} from './frames/EmptyFrame';
import {ImageFrame} from './frames/ImageFrame';
import {IImageFrame} from "./interface/IFrame";

class EBoardBody extends React.PureComponent{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    render(){
        const {boardMap} = this.context;
        const boardList = boardMap.toArray();
        return (
            <div className="layout-board-container">
                {
                    boardList.map((board)=>{
                        switch (board.type) {
                            case FRAME_TYPE_ENUM.EMPTY:
                                return <EmptyFrame key={board.id} {...board}/>;
                            case FRAME_TYPE_ENUM.IMAGE:
                                return <ImageFrame key={board.id} {...(board as IImageFrame)}/>;
                            default:
                                return  null;
                        }
                    })
                }
            </div>
        )
    }
}

export {EBoardBody};