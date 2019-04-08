import Timer = NodeJS.Timer;

class Common {
    public static getImageSize(image:HTMLImageElement,callback:({width,height}?:{width:number;height:number})=>void){
        let interval:Timer;
        const check=()=>{
            const {naturalWidth,naturalHeight} = image;
            if(naturalWidth>0 && naturalHeight>0){
                if(interval){clearInterval(interval)}
                callback({width:naturalWidth,height:naturalHeight});
            }
        };
        interval = setInterval(check,50);
        check();
        image.onerror=()=>{
            if(interval){clearInterval(interval)};
            callback();
        }
    }
    public static sin18:number=Math.abs(Math.sin(18/180 * Math.PI));
    public static sin36:number=Math.sin(36/180 * Math.PI);
    public static sin72:number=Math.sin(72/180 * Math.PI);
    public static sin108:number=Math.sin(108/180 * Math.PI);
    public static sin144:number=Math.sin(144/180 * Math.PI);
    public static cos36:number=Math.cos(36/180 * Math.PI);
    public static cos72:number=Math.cos(72/180 * Math.PI);
    public static cos108:number=Math.cos(108/180 * Math.PI);
    public static cos144:number=Math.cos(144/180 * Math.PI);
    public static angleRatio:number=Math.PI/180;
}

export {Common}