/**
 * @disc:分页
 * @author:yanxinaliang
 * @time：2019/4/7 22:51
 */
import {Bind} from 'lodash-decorators';
import React, {ChangeEvent} from 'react';
import "../style/pagination.less";
import "../font/iconfont.css";
import Input from "antd/lib/input";
import "antd/lib/input/style";


declare interface IPaginationProps{
    onChange:(pageNo:number)=>void;
    total:number;
    current:number;
}

declare interface IPaginationState {
    control:boolean;
    inputVal:string;
}

class Pagination extends React.PureComponent<IPaginationProps,IPaginationState>{
    constructor(props:IPaginationProps){
        super(props);
        this.state={
            control:true,
            inputVal:""
        }
    }
    @Bind
    private onChange(event:ChangeEvent<HTMLInputElement>){
        // limit min max number
        const value = event.target.value;
        if(/^\d*$/.test(value)&&Number(value)<=this.props.total&&Number(value)>0){
            this.setState({
                inputVal:value
            })
        }
    }
    @Bind
    private onPrev(){
        const {current=0} = this.props;
        const prev = current-1;
        this.props.onChange(prev);
    }
    @Bind
    private onNext(){
        const {current=0} = this.props;
        const next = current+1;
        this.props.onChange(next);
    }
    @Bind
    private onOKey(){
        const {inputVal} = this.state;
        if(/^\d+$/.test(inputVal)){
            const next = Number(inputVal);
            this.props.onChange(next);
        }
        this.setState({
            inputVal:""
        })
    }
    render(){
        const {control,inputVal} = this.state;
        const {total,current=0} = this.props;
        return (
            <div className={`board-pagination ${control?"board-pagination-control":""}`}>
                {
                    control?<i className={`eboard-icon eboard-icon-prev board-pagination-prev ${current===1?"disabled":""}`} onClick={this.onPrev}/>:null
                }
                <span className="board-pagination-current">{current}</span>
                <span className="board-pagination-split">/</span>
                <span className="board-pagination-total">{total}</span>
                {
                    control?[
                        <i key="next" className={`eboard-icon eboard-icon-next board-pagination-next ${current===total?"disabled":""}`} onClick={this.onNext}/>,
                        <Input key="input" value={inputVal} className="board-pagination-input" onChange={this.onChange}/>,
                        <button key="btn" className="board-pagination-go" onClick={this.onOKey}>Go</button>
                    ]:null
                }
            </div>
        )
    }
}

export {Pagination};