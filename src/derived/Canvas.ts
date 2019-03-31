import {fabric} from "fabric";
import {ICanvasOptions} from "fabric/fabric-impl";

class Canvas extends fabric.Canvas{
    public width:number;
    public height:number;
    public container:HTMLDivElement;
    constructor(element: HTMLCanvasElement | string, options?: ICanvasOptions){
        super(element,options);
        this.container=this.getElement().parentElement as HTMLDivElement;
    }
    public setContainerClass(className:string){
        this.container.className=className;
    }
}

export {Canvas};