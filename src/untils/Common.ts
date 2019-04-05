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
}

export {Common}