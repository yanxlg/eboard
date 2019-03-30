/**
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/3/30 17:48
 */

import React from "react";
import {EBoardContext, IEBoardContext} from './EBoardContext';
import {EmptyFrame} from './frames/EmptyFrame';
import {ImageFrame} from './frames/ImageFrame';

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
                            case 'empty':
                                return <EmptyFrame key={board.id} {...board}/>;
                            case 'image':
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