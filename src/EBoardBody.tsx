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
        const boardList = EBoardContext.getBoardList();
        return (
            <div className="layout-board-container">
                {
                    boardList.map((board)=>{
                        const {type} = board;
                        return type===FRAME_TYPE_ENUM.EMPTY?<EmptyFrame key={board.wbNumber} {...board}/>:<ImageFrame key={board.wbNumber} {...(board as IImageFrame)}/>;
                    })
                }
            </div>
        )
    }
}

export {EBoardBody};