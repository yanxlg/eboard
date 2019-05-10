/**
 * @disc:EBoard Component
 * @author:yanxinaliang
 * @time：2019/3/30 13:54
 */
import {Bind} from 'lodash-decorators';
import React, {RefObject} from 'react';
import {EBoardBody} from './EBoardBody';
import {EBoardContext} from './EBoardContext';
import {EBoardTab} from './EBoardTab';
import {EBoardTool} from './EBoardTool';
import {FRAME_TYPE_ENUM} from './enums/EBoardEnum';
import {IBaseFrame, IMessage} from './interface/IFrame';
import {ResizeEmitter} from './ResizeEmitter';
import "./style/layout.less";
import {MessageTag} from './static/MessageTag';
import {EMap} from './untils/Map';


declare interface IEBoardProps {
    onMessageListener?:(message:string)=>void;
    disabled?:boolean;  // 默认值为false
    allowDocControl?:boolean;// 是否允许doc操作，如果允许则可以滚动、翻页，否则不允许操作,默认值为false
}

class EBoard extends React.PureComponent<IEBoardProps>{
    public static version:string = require("../package.json").version;
    private contextRef:RefObject<EBoardContext> = React.createRef();
    componentDidMount(): void {
        document.addEventListener("contextmenu", (event)=>{
            event.preventDefault();
        });
    }
    @Bind
    private onMessageListener(message:object){
        this.props.onMessageListener&&this.props.onMessageListener(JSON.stringify(message));
    }
    @Bind
    public dispatchMessage(message:IMessage,timestamp:number,animation:boolean){
       this.contextRef.current.dispatchMessage(message,timestamp,animation);
    }
    @Bind
    public addImages(images:string[],wbName?:string){
        const wbNumber = Date.now().toString();
        wbName=wbName||"图片";
        this.contextRef.current.addBoard({
            wbType:FRAME_TYPE_ENUM.IMAGES,
            wbNumber,
            images,
            layoutMode:"top_auto",
            wbName,
            pageNum:1
        },wbNumber,1);
        this.contextRef.current.updateActiveWbNumber(wbNumber,1);
        this.onMessageListener({
            tag:MessageTag.CreateFrameGroup,
            ...{
                wbType:FRAME_TYPE_ENUM.IMAGES,
                wbNumber,
                images,
                layoutMode:"top_auto",
                wbName,
                pageNum:1
            }
        });
        return wbNumber;
    }
    @Bind
    public recovery(messageList:any[]){
        let boardMap = new EMap<string,IBaseFrame>();
        let docPageNumMap=new EMap<string,number>();
        let imageListMap:Map<string,string[]>=new Map<string, string[]>();
        let activeWbNumber:string="";
        messageList.forEach((message:any,index)=>{
            const {tag,wbNumber,pageNum,wbType,canRemove,wbName,wbIcon,layoutMode,images,vScrollOffset} = message;
            switch (tag) {
                case MessageTag.CreateFrame:
                case MessageTag.CreateFrameGroup:
                    boardMap.set(EBoardContext.getKey(wbNumber,pageNum),{
                        wbNumber,
                        wbType,
                        canRemove,
                        wbName,
                        wbIcon,
                        layoutMode,
                        images,
                        pageNum
                    });
                    activeWbNumber=wbNumber;
                    if(void 0 !== pageNum){
                       docPageNumMap.set(wbNumber,pageNum);
                    }
                    if(images){
                        imageListMap.set(wbNumber,images);
                    }
                    break;
                case MessageTag.SwitchToFrame:
                    activeWbNumber=wbNumber;
                    break;
                case MessageTag.TurnPage:
                    const key = EBoardContext.getKey(wbNumber,pageNum);
                    if(boardMap.has(key)){
                        activeWbNumber=wbNumber;
                        if(void 0 !== pageNum){
                            docPageNumMap.set(wbNumber,pageNum);
                        }
                    }else{
                        boardMap.set(key,{
                            wbNumber,
                            wbType:FRAME_TYPE_ENUM.IMAGES,
                            canRemove,
                            wbName,
                            layoutMode:"top_auto",
                            missTab:true,
                            images:imageListMap.get(wbNumber)||[],
                            pageNum
                        });
                        activeWbNumber=wbNumber;
                        if(void 0 !== pageNum){
                            docPageNumMap.set(wbNumber,pageNum);
                        }
                    }
                    break;
                case MessageTag.Shape:
                case MessageTag.Transform:
                case MessageTag.Delete:
                    // TODO 形状，需要记录在board实例中
                    const board1 = boardMap.get(EBoardContext.getKey(wbNumber,pageNum));
                    if(board1){
                        board1.cacheMessage=board1.cacheMessage||[];
                        board1.cacheMessage.push(message);
                    }
                    break;
                case MessageTag.Clear:
                    // TODO 清空board中的缓存字段
                    const board2 = boardMap.get(EBoardContext.getKey(wbNumber,pageNum));
                    if(board2){
                        board2.cacheMessage=[];
                    }
                    break;
                case MessageTag.Scroll:
                    // TODO 设置board的滚动条位置
                    console.log("scroll",wbNumber,pageNum);
                    console.log(boardMap.clone());
                    console.log(EBoardContext.getKey(wbNumber,pageNum));
                    const board3 = boardMap.get(EBoardContext.getKey(wbNumber,pageNum));
                    console.log(board3);
                    if(board3){
                        board3.vScrollOffset=vScrollOffset;
                    }
                    break;
                case MessageTag.RemoveFrame:
                    if(void 0 === pageNum){
                        boardMap.forEach((board,key)=>{
                            if(board.wbNumber===wbNumber){
                                boardMap.delete(key);
                            }
                        });
                    }else{
                        boardMap.delete(EBoardContext.getKey(wbNumber,pageNum));
                    }
                    if(imageListMap.has(wbNumber)){
                        imageListMap.delete(wbNumber);
                    }
                    break;
            }
        });
        console.log(boardMap);
        this.contextRef.current.recover(boardMap,docPageNumMap,imageListMap,activeWbNumber);
    }
    @Bind
    public addEmptyFrame(){
        this.contextRef.current.addEmptyFrame();
    }
    @Bind
    public addImage(image:string,wbName?:string){
        const wbNumber = Date.now().toString();
        wbName=wbName||"图片";
        this.contextRef.current.addBoard({
            wbType:FRAME_TYPE_ENUM.IMAGE,
            wbNumber,
            images:[image],
            layoutMode:"top_auto",
            wbName,
        },wbNumber);
        this.contextRef.current.updateActiveWbNumber(wbNumber);
        this.onMessageListener({
            tag:MessageTag.CreateFrame,
            ...{
                wbType:FRAME_TYPE_ENUM.IMAGE,
                wbNumber,
                images:[image],
                layoutMode:"top_auto",
                wbName,
            }
        });
        return wbNumber;
    }
    public render(){
        const {disabled,allowDocControl} = this.props;
        return (
            <EBoardContext ref={this.contextRef} onMessageListener={this.onMessageListener} disabled={disabled} allowDocControl={allowDocControl}>
                <ResizeEmitter/>
                {
                    disabled?null:[
                        <EBoardTab key="tab"/>,
                        <EBoardTool key="tool"/>
                    ]
                }
                <EBoardBody/>
            </EBoardContext>
        )
    }
}

export {EBoard}