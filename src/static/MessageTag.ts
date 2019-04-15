/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/4/15 12:39
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * * @Last Modified time: 2019/4/15 12:39
 * @disc:MessageTag
 */
export enum MessageTag{
    CreateFrame=0,
    CreateFrameGroup=1,
    SwitchToFrame=2,
    Clear=3,
    AllowHtmlAction=4,
    DisAllowHtmlAction=5,
    Scroll=6,
    Delete=7,
    Cursor=8,
    SelectionMove=9,
    SelectionScale=10,
    SelectionRotate=11,
    RemoveTab=12,
    Shape=13,
    TurnPage=14,// 翻页
    Paste=15,
    Cut=16,
    UndoRedo=17,
}