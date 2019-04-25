/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 16:05
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 16:05
 * @disc:事件处理
 */

class EventEmitter<T extends string> {
    private el:HTMLDivElement=document.createElement("div");
    public on(type:T,eventListener:(ev:any)=>void){
        this.el.addEventListener(type,eventListener);
    };
    public trigger(type:T,data?:object){
        let event:any=document.createEvent("HTMLEvents");
        event.initEvent(type,false,false);
        event.data=data;
        this.el.dispatchEvent(event);
    };
    public off(type:T,eventListener:(ev:any)=>void){
        this.el.removeEventListener(type,eventListener);
    }
}

export {EventEmitter};