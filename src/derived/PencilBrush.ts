import {fabric} from "fabric";
import {Canvas} from "./Canvas";
import {Pencil} from "./Pencil";

class PencilBrush extends fabric.PencilBrush{
    private canvas:Canvas;
    private _render:()=>void;
    public strokeMiterLimit:number;
    public shadow:fabric.Shadow;
    constructor(canvas:Canvas){
        // @ts-ignore
        super(canvas);
    }
    public onMouseDown:(pointer:fabric.Point)=>void;
    public onMouseMove:(pointer:fabric.Point)=>void;
    public onMouseUp:()=>void;
    // @override
    public createPath(pathData:string) {
        const path = new Pencil(pathData, {
            fill: null,
            stroke: this.color,
            strokeWidth: this.width,
            strokeLineCap: this.strokeLineCap,
            strokeMiterLimit: this.strokeMiterLimit,
            strokeLineJoin: this.strokeLineJoin,
            strokeDashArray: this.strokeDashArray,
        });
        let position = new fabric.Point(path.left + path.width / 2, path.top + path.height / 2);
        position = path.translateToGivenOrigin(position, 'center', 'center', path.originX, path.originY);
        path.top = position.y;
        path.left = position.x;
        if (this.shadow) {
            this.shadow.affectStroke = true;
            path.setShadow(this.shadow);
        }
        return path;
    }
    public clear(){
        const ctx  = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
    }
    public render(){
        this._render();
    }
}

export {PencilBrush}