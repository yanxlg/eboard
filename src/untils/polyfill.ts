/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/3/30 17:26
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/3/30 17:26
 * @disc:polyfill
 */
// @ts-ignore
declare interface Map<K,V> {
    clone(): Map<K,V>;
    toArray():V[];
}

Map.prototype.clone=function(){
    let _clone = new Map();
    this.forEach((value:any,key:any)=>{
        _clone.set(key,value)
    });
    return _clone;
};

Map.prototype.toArray=function(){
    let arr:any[]=[];
    this.forEach((value:any,key:any)=>{
        arr.push(value);
    });
    return arr;
};