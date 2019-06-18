import {MessageTag} from '../enums/MessageTag';

/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/6/18 13:39
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/6/18 13:39
 * @disc:CacheMessageList
 */

class CacheMessageList {
    private messageList:Map<string|number,any>=new Map<string|number,any>();// 标签或Id，shape存储id,其他使用
    public static from(cacheMessageList?:CacheMessageList){
        return cacheMessageList||new CacheMessageList();
    }
    public push(message:any) {
        // 消息需要过滤
        const {tag,objectId} = message;
        switch (tag) {
            case MessageTag.Shape:
                this.messageList.set(objectId,message);
                break;
            case MessageTag.Transform:
                this.messageList.set(objectId,message);
                break;
        }
    }
    public clear(){
        this.messageList.clear();
    }
    public map(callback:(value:any,key:number|string)=>void){
        this.messageList.forEach(callback);
    }
    public forEach(callback:(value:any,key:number|string)=>void){
        this.messageList.forEach(callback);
    }
    public delete(keys:string[]|number[]|string|number){
        if(typeof keys ==="string"||typeof keys === "number"){
            this.messageList.delete(keys);
        }else{
            keys.forEach((key:string|number)=>{this.messageList.delete(key)});
        }
    }
}

export {CacheMessageList};