/**
 * @disc:组图窗口
 * @author:yanxinaliang
 * @time：2019/4/1 11:01
 */
import React from "react";
import {IImagesFrame} from "../interface/IFrame";

class ImagesFrame extends React.PureComponent<IImagesFrame>{
    render(){
        const {children} = this.props;
        console.log(children);
        return (
            <div>
            s
            </div>
        )
    }
}

export {ImagesFrame};