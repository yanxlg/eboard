/**
 * @disc:组图窗口
 * @author:yanxinaliang
 * @time：2019/4/1 11:01
 */
import {Bind} from 'lodash-decorators';
import React from "react";
import {Pagination} from '../components/pagination';
import {EBoardContext, IEBoardContext} from '../EBoardContext';
import {IImagesFrame} from '../interface/IFrame';
import "../style/frames.less";
import {ImageFrame} from './ImageFrame';



declare interface IImagesFrameProps extends IImagesFrame{
    width:number;
    height:number;
    dimensions:{
        width:number;
        height:number;
    };
    active:boolean;
}

declare interface IImagesFrameState {
    animationClass:string;
}

class ImagesFrame extends React.PureComponent<IImagesFrameProps,IImagesFrameState>{
    public static contextType = EBoardContext.Context;
    public context:IEBoardContext;
    constructor(props:IImagesFrameProps){
        super(props);
        this.state={
            animationClass:"board-frames-right"
        }
    }
    @Bind
    private getChildes(){
        const {frames,wbNumber,pageNo,width,height,dimensions} = this.props;
        let imageFrames:React.ReactNode[]=[];
        frames.forEach((frame,key)=>{
            frame.render&&imageFrames.push(<ImageFrame {...frame} key={key} wbNumber={`${wbNumber}.${key}`} active={pageNo===key} width={width} height={height} dimensions={dimensions}/>);
        });
        return imageFrames;
    }
    @Bind
    private onPageChange(pageNo:number){
        const {wbNumber} = this.props;
        const {boardMap} = this.context;
        let imagesFrame = boardMap.get(wbNumber) as IImagesFrame;
        const oldPageNo = imagesFrame.pageNo;
        if(oldPageNo===pageNo){return}
        imagesFrame.pageNo=pageNo;
        imagesFrame.frames.get(pageNo).render=true;
        this.context.updateBoardMap(boardMap);
        this.setState({
            animationClass:oldPageNo<pageNo?"board-frames-right":"board-frames-left"
        })
    }
    render(){
        const {active,width,height,frames} = this.props;
        const {animationClass} = this.state;
        return (
            <div className={`board-frames ${active?"board-frame-active":""} ${animationClass}`} style={{width,height}}>
                {
                    this.getChildes()
                }
                <Pagination defaultCurrent={1} total={frames.size} onChange={this.onPageChange}/>
            </div>
        )
    }
}

export {ImagesFrame};