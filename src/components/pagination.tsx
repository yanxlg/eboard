/**
 * @disc:分页
 * @author:yanxinaliang
 * @time：2019/4/7 22:51
 */
import React from "react";
import "../style/pagination.less";
import "../font/iconfont.css";
import Input from "antd/lib/input";
import "antd/lib/input/style";

declare interface IPaginationState {
    current:number;
}

class Pagination extends React.PureComponent<{},IPaginationState>{
    constructor(props:{}){
        super(props);
        this.state={
            current:0
        }
    }
    render(){
        const {current} = this.state;
        return (
            <div className="board-pagination board-pagination-control">
                <i className="eboard-icon eboard-icon-prev board-pagination-prev"/>
                <span className="board-pagination-current">2</span>
                <span className="board-pagination-split">/</span>
                <span className="board-pagination-total">10</span>
                <i className="eboard-icon eboard-icon-next board-pagination-next"/>
                <Input value={current} className="board-pagination-input"/>
                <button className="board-pagination-go">Go</button>
            </div>
        )
    }
}

export {Pagination};