/**
 * @disc:DESC
 * @type:TYPE
 * @dependence:DEPENDENCE
 * @author:yanxinaliang
 * @time：2019/4/5 13:10
 */
import {Bind} from 'lodash-decorators';
import React,{MouseEvent} from 'react';
import {ITab} from '../interface/IFrame';

declare interface IEBoardTabItemProps extends ITab{
    activeNumber:string;
    onClick:(wbNumber:string,element:HTMLDivElement)=>void;
    onRemove:(wbNumber:string)=>void;
}


class EBoardTabItem extends React.PureComponent<IEBoardTabItemProps>{
    @Bind
    private onClick(e:MouseEvent<HTMLDivElement>){
        this.props.onClick(this.props.wbNumber,e.currentTarget);
    }
    @Bind
    private onRemove(e:MouseEvent<HTMLDivElement>){
        e.stopPropagation();
        this.props.onRemove(this.props.wbNumber);
    }
    render(){
        const {activeNumber,wbNumber,name,canRemove} = this.props;
        return (
            <div data-e-id={wbNumber} className={`tab-item ${activeNumber===wbNumber?"tab-active":""} ${canRemove!==false?"tab-item-can-remove":""}`} onClick={this.onClick}>
                <span className="tab-item-name">
                    {name}
                </span>
                {
                    canRemove!==false?(
                        <i className="tab-item-remove eboard-icon eboard-icon-remove" onClick={this.onRemove}/>
                    ):null
                }
            </div>
        )
    }
}

export {EBoardTabItem}

