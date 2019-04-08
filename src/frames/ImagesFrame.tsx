/**
 * @disc:组图窗口
 * @author:yanxinaliang
 * @time：2019/4/1 11:01
 */
import {Bind} from 'lodash-decorators';
import React from "react";
import {Pagination} from '../components/pagination';
import {IImagesFrame} from '../interface/IFrame';
import "../style/frames.less";
import {ImageFrame} from './ImageFrame';



declare interface IImagesFrameProps extends IImagesFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    }
}


class ImagesFrame extends React.PureComponent<IImagesFrameProps>{
    @Bind
    private getChildes(){
        const {children,wbNumber,pageNo,width,height,dimensions} = this.props;
        let imageFrames:React.ReactNode[]=[];
        children.forEach((child,key)=>{
            imageFrames.push(<ImageFrame {...child} key={key} wbNumber={`${wbNumber}.${key}`} active={pageNo===key} width={width} height={height} dimensions={dimensions}/>);
        });
        return imageFrames;
    }
    render(){
        const {active,width,height} = this.props;
        return (
            <div className={`board-frames ${active?"board-frame-active":""}`} style={{width,height}}>
                {
                    this.getChildes()
                }
                <Pagination/>
            </div>
        )
    }
}

export {ImagesFrame};