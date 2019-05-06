/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/7 10:58
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/4/7 10:58
 * @disc:Cursor
 */
const handCur = require("../cursor/hand.cur");
const moveCur = require("../cursor/move.cur");
const crossCur = require("../cursor/cross.cur");
const defaultCur = require("../cursor/default.cur");
const nResizeCur = require("../cursor/vert.cur");
const eResizeCur = require("../cursor/horz.cur");
const neswResizeCur = require("../cursor/nesw-resize.cur");
const nwseResizeCur = require("../cursor/nwse-resize.cur");
const pointerCur = require("../cursor/pointer.cur");
const textCur = require("../cursor/text.cur");
const feruleCur = require("../cursor/ferule.cur");
const eraseCur = require("../cursor/erase.cur");
class Cursor {
    public static hand=`url("${handCur}") 0 20,default`;
    public static move=`url("${moveCur}") 11 11,move`;
    public static cross=`url("${crossCur}") 12 12,crosshair`;
    public static default=`url("${defaultCur}") 0 0,default`;
    public static nResize=`url("${nResizeCur}") 4 12,n-resize`;
    public static eResize=`url("${eResizeCur}") 12 4,e-resize`;
    public static neswResize=`url("${neswResizeCur}") 8 8,nesw-resize`;
    public static nwseResize=`url("${nwseResizeCur}") 8 8,nesw-resize`;
    public static pointer=`url("${pointerCur}") 11 11,pointer`;
    public static text=`url("${textCur}") 2 12,text`;
    public static ferule=`url("${feruleCur}") 12 12,default`;
    public static erase=`url("${eraseCur}") 0 0,default`;
}

export {Cursor}