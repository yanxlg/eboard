/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/5 17:43
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/5 17:43
 * @disc:ID 生成器
 */

class IDGenerator {
    private readonly _prefix:string;
    private _number:number;
    constructor(userId:number,userRole:string){
        this._number=Date.now();
        this._prefix=`${userRole}_${userId}_`;
    }
    public getId(){
        this._number++;
        return this._prefix+this._number;
    }
}

export {IDGenerator};