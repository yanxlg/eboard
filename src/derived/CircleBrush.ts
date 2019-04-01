import {fabric} from "fabric"
import {Canvas} from "./Canvas";
import {ICirclePoint} from "../interface/IFrame";
import {Circle} from "./Circle";

class CircleBrush extends fabric.CircleBrush{
    private canvas:Canvas;
    private points:ICirclePoint[];
    private _render:()=>void;
    private _setShadow:()=>void;
    private _resetShadow:()=>void;
    constructor(canvas:Canvas){
        // @ts-ignore
        super(canvas);
    }
    // @override
    public onMouseDown(pointer:fabric.Point){
        // 需要先释放掉所有的points
        const startPoint:ICirclePoint = pointer;
        startPoint.radius=0;
        startPoint.fill=this.color;
        this.points=[startPoint];
        this.clear();
        this._setShadow();
    };
    // @override
    public onMouseMove(pointer:fabric.Point){
        let startPoint = this.points[0];
        if(!startPoint){
            startPoint.radius=this.width;
            startPoint.fill=this.color;
            this.points=[pointer];
        }else{
            startPoint.radius=Math.ceil(Math.sqrt(Math.pow(pointer.x-startPoint.x,2) +
                Math.pow(pointer.y-startPoint.y,2)));
        }
        this.clear();
        this.render();
    };
    // @override
    public onMouseUp(){
        const point = this.points[0];
        if(!point||point.radius===0){return}
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        const circle = new Circle({
            radius: point.radius,
            left: point.x,
            top: point.y,
            originX: 'center',
            originY: 'center',
            fill: point.fill
        });
        this.shadow && circle.setShadow(this.shadow);
        this.canvas.add(circle);
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas.requestRenderAll();
        fabric.util.requestAnimFrame(()=>{
            this.canvas.fire('path:created', { path: circle });
            this.canvas.clearContext(this.canvas.contextTop);
            this._resetShadow();
        });
    };
    public clear(){
        const ctx  = this.canvas.contextTop;
        this.canvas.clearContext(ctx);
    }
    public render(){
        this._render();
    }
}

export {CircleBrush}