// import {RefObject} from 'react';
import {RefObject} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EBoard} from './EBoard';
import registerServiceWorker from './registerServiceWorker';

// let promise = new Promise((resolve)=>{setTimeout(()=>{resolve()},5000)});

const eBoardRef:RefObject<EBoard> = React.createRef();
const eBoardRef1:RefObject<EBoard> = React.createRef();


function onMessage(message:string){
    // 延迟5s + random()[0-2]s 处理，通过promise来处理
    
    eBoardRef.current.dispatchMessage(JSON.parse(message) as any,0,true);
/*    promise=promise.then(()=>{
        return new Promise((resolve)=>{
            const time = Math.random()*100*2;
           setTimeout(()=>{
               // console.log(JSON.stringify(message));
               eBoardRef.current.dispatchMessage(JSON.parse(message) as any,0);
               resolve();
           },time);
        });
    })*/
}

function addImages(){
      const images:string[]=[require("./frames/1.jpg"),
           require("./frames/2.jpg"),
           require("./frames/3.jpg"),
           require("./frames/4.jpg"),
           require("./frames/5.jpg")];
    eBoardRef1.current.addImage(images[0],"图片");
}


setTimeout(()=>{
    let messages =[
        {"tag":1,"wbType":"images","wbNumber":"1556246232493","images":["/static/media/1.6d88f062.jpg","/static/media/2.1c2607fc.jpg","/static/media/3.cb2b601e.jpg","/static/media/4.3dd243db.jpg","/static/media/5.11335414.jpg"],"layoutMode":"top_auto","wbName":"图片","pageNum":1},
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503}],"stroke":"#f66c00","strokeWidth":4}},
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391}],"stroke":"#f66c00","strokeWidth":4}},
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703},{"x":858,"y":783},{"x":806,"y":787}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703},{"x":858,"y":783},{"x":806,"y":787},{"x":788,"y":757},{"x":782,"y":715},{"x":782,"y":675},{"x":782,"y":635}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703},{"x":858,"y":783},{"x":806,"y":787},{"x":788,"y":757},{"x":782,"y":715},{"x":782,"y":675},{"x":782,"y":635},{"x":796,"y":569}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703},{"x":858,"y":783},{"x":806,"y":787},{"x":788,"y":757},{"x":782,"y":715},{"x":782,"y":675},{"x":782,"y":635},{"x":796,"y":569},{"x":802,"y":559}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224200","wbNumber":"1556246232493","pageNum":1,"attributes":{"points":[{"x":462,"y":615},{"x":462,"y":615},{"x":480,"y":583},{"x":490,"y":569},{"x":502,"y":553},{"x":556,"y":503},{"x":580,"y":483},{"x":772,"y":391},{"x":930,"y":451},{"x":1022,"y":617},{"x":988,"y":703},{"x":858,"y":783},{"x":806,"y":787},{"x":788,"y":757},{"x":782,"y":715},{"x":782,"y":675},{"x":782,"y":635},{"x":796,"y":569},{"x":802,"y":559},{"x":802,"y":555}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":0,"wbType":"empty","wbNumber":"1556246236803","canRemove":true,"wbName":"白板"}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727},{"x":834,"y":755},{"x":788,"y":771},{"x":774,"y":773},{"x":750,"y":773}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727},{"x":834,"y":755},{"x":788,"y":771},{"x":774,"y":773},{"x":750,"y":773},{"x":736,"y":773},{"x":722,"y":765},{"x":712,"y":757}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727},{"x":834,"y":755},{"x":788,"y":771},{"x":774,"y":773},{"x":750,"y":773},{"x":736,"y":773},{"x":722,"y":765},{"x":712,"y":757},{"x":696,"y":697},{"x":696,"y":643},{"x":710,"y":595}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727},{"x":834,"y":755},{"x":788,"y":771},{"x":774,"y":773},{"x":750,"y":773},{"x":736,"y":773},{"x":722,"y":765},{"x":712,"y":757},{"x":696,"y":697},{"x":696,"y":643},{"x":710,"y":595},{"x":730,"y":565},{"x":744,"y":549},{"x":788,"y":525},{"x":824,"y":511}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224201","wbNumber":"1556246236803","attributes":{"points":[{"x":682,"y":561},{"x":682,"y":561},{"x":682,"y":563},{"x":682,"y":565},{"x":684,"y":563},{"x":688,"y":557},{"x":694,"y":549},{"x":712,"y":531},{"x":744,"y":509},{"x":764,"y":495},{"x":790,"y":485},{"x":810,"y":477},{"x":850,"y":471},{"x":892,"y":475},{"x":934,"y":511},{"x":956,"y":555},{"x":962,"y":607},{"x":950,"y":645},{"x":940,"y":663},{"x":914,"y":697},{"x":880,"y":727},{"x":834,"y":755},{"x":788,"y":771},{"x":774,"y":773},{"x":750,"y":773},{"x":736,"y":773},{"x":722,"y":765},{"x":712,"y":757},{"x":696,"y":697},{"x":696,"y":643},{"x":710,"y":595},{"x":730,"y":565},{"x":744,"y":549},{"x":788,"y":525},{"x":824,"y":511},{"x":848,"y":501},{"x":852,"y":501},{"x":858,"y":501}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":0,"wbType":"empty","wbNumber":"1556246239240","canRemove":true,"wbName":"白板"}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899}],"stroke":"#f66c00","strokeWidth":4}}
,{"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553},{"x":894,"y":547},{"x":762,"y":561},{"x":686,"y":575}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553},{"x":894,"y":547},{"x":762,"y":561},{"x":686,"y":575},{"x":644,"y":593},{"x":624,"y":607},{"x":614,"y":615},{"x":604,"y":621}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553},{"x":894,"y":547},{"x":762,"y":561},{"x":686,"y":575},{"x":644,"y":593},{"x":624,"y":607},{"x":614,"y":615},{"x":604,"y":621},{"x":594,"y":633},{"x":578,"y":643},{"x":572,"y":647}],"stroke":"#f66c00","strokeWidth":4}}
,{"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553},{"x":894,"y":547},{"x":762,"y":561},{"x":686,"y":575},{"x":644,"y":593},{"x":624,"y":607},{"x":614,"y":615},{"x":604,"y":621},{"x":594,"y":633},{"x":578,"y":643},{"x":572,"y":647},{"x":568,"y":651},{"x":566,"y":653},{"x":564,"y":655}],"stroke":"#f66c00","strokeWidth":4}}
,{"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224202","wbNumber":"1556246239240","attributes":{"points":[{"x":596,"y":285},{"x":596,"y":285},{"x":604,"y":311},{"x":608,"y":331},{"x":628,"y":417},{"x":642,"y":477},{"x":674,"y":663},{"x":692,"y":779},{"x":700,"y":899},{"x":702,"y":941},{"x":704,"y":989},{"x":704,"y":1001},{"x":704,"y":1009},{"x":704,"y":1021},{"x":704,"y":1027},{"x":704,"y":1029},{"x":708,"y":1033},{"x":716,"y":1035},{"x":726,"y":1039},{"x":732,"y":1039},{"x":750,"y":1039},{"x":788,"y":1031},{"x":828,"y":1015},{"x":846,"y":999},{"x":884,"y":959},{"x":916,"y":911},{"x":956,"y":843},{"x":996,"y":743},{"x":1004,"y":711},{"x":1018,"y":651},{"x":1022,"y":601},{"x":1022,"y":579},{"x":1022,"y":569},{"x":1022,"y":567},{"x":1018,"y":563},{"x":978,"y":553},{"x":894,"y":547},{"x":762,"y":561},{"x":686,"y":575},{"x":644,"y":593},{"x":624,"y":607},{"x":614,"y":615},{"x":604,"y":621},{"x":594,"y":633},{"x":578,"y":643},{"x":572,"y":647},{"x":568,"y":651},{"x":566,"y":653},{"x":564,"y":655},{"x":564,"y":657},{"x":562,"y":657},{"x":560,"y":657}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224203","wbNumber":"1556246239240","attributes":{"points":[{"x":486,"y":515},{"x":486,"y":515}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224203","wbNumber":"1556246239240","attributes":{"points":[{"x":486,"y":515},{"x":486,"y":515},{"x":488,"y":515},{"x":494,"y":513},{"x":526,"y":501},{"x":552,"y":491},{"x":576,"y":487},{"x":606,"y":479},{"x":650,"y":473}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224203","wbNumber":"1556246239240","attributes":{"points":[{"x":486,"y":515},{"x":486,"y":515},{"x":488,"y":515},{"x":494,"y":513},{"x":526,"y":501},{"x":552,"y":491},{"x":576,"y":487},{"x":606,"y":479},{"x":650,"y":473},{"x":694,"y":465},{"x":770,"y":457},{"x":812,"y":455},{"x":890,"y":451}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224203","wbNumber":"1556246239240","attributes":{"points":[{"x":486,"y":515},{"x":486,"y":515},{"x":488,"y":515},{"x":494,"y":513},{"x":526,"y":501},{"x":552,"y":491},{"x":576,"y":487},{"x":606,"y":479},{"x":650,"y":473},{"x":694,"y":465},{"x":770,"y":457},{"x":812,"y":455},{"x":890,"y":451},{"x":936,"y":451},{"x":974,"y":451}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224203","wbNumber":"1556246239240","attributes":{"points":[{"x":486,"y":515},{"x":486,"y":515},{"x":488,"y":515},{"x":494,"y":513},{"x":526,"y":501},{"x":552,"y":491},{"x":576,"y":487},{"x":606,"y":479},{"x":650,"y":473},{"x":694,"y":465},{"x":770,"y":457},{"x":812,"y":455},{"x":890,"y":451},{"x":936,"y":451},{"x":974,"y":451},{"x":982,"y":451},{"x":986,"y":451},{"x":988,"y":451}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":0,"wbType":"empty","wbNumber":"1556246241939","canRemove":true,"wbName":"白板"}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901},{"x":788,"y":869},{"x":764,"y":839},{"x":754,"y":827},{"x":746,"y":813}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901},{"x":788,"y":869},{"x":764,"y":839},{"x":754,"y":827},{"x":746,"y":813},{"x":742,"y":801},{"x":734,"y":775},{"x":736,"y":749},{"x":748,"y":717}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901},{"x":788,"y":869},{"x":764,"y":839},{"x":754,"y":827},{"x":746,"y":813},{"x":742,"y":801},{"x":734,"y":775},{"x":736,"y":749},{"x":748,"y":717},{"x":758,"y":697},{"x":778,"y":667},{"x":792,"y":647},{"x":798,"y":641}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901},{"x":788,"y":869},{"x":764,"y":839},{"x":754,"y":827},{"x":746,"y":813},{"x":742,"y":801},{"x":734,"y":775},{"x":736,"y":749},{"x":748,"y":717},{"x":758,"y":697},{"x":778,"y":667},{"x":792,"y":647},{"x":798,"y":641},{"x":808,"y":633},{"x":810,"y":631}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":13,"shapeType":"pencil","objectId":"ds_111_1556246224204","wbNumber":"1556246241939","attributes":{"points":[{"x":720,"y":725},{"x":720,"y":725},{"x":692,"y":745},{"x":666,"y":757},{"x":658,"y":761},{"x":652,"y":763},{"x":646,"y":765},{"x":644,"y":767},{"x":642,"y":767},{"x":640,"y":767},{"x":638,"y":767},{"x":638,"y":763},{"x":638,"y":745},{"x":646,"y":725},{"x":664,"y":689},{"x":684,"y":661},{"x":724,"y":619},{"x":806,"y":565},{"x":864,"y":543},{"x":906,"y":527},{"x":940,"y":519},{"x":1010,"y":517},{"x":1060,"y":527},{"x":1078,"y":537},{"x":1092,"y":549},{"x":1124,"y":645},{"x":1120,"y":721},{"x":1094,"y":799},{"x":1058,"y":843},{"x":984,"y":893},{"x":932,"y":911},{"x":896,"y":919},{"x":884,"y":919},{"x":858,"y":917},{"x":826,"y":901},{"x":788,"y":869},{"x":764,"y":839},{"x":754,"y":827},{"x":746,"y":813},{"x":742,"y":801},{"x":734,"y":775},{"x":736,"y":749},{"x":748,"y":717},{"x":758,"y":697},{"x":778,"y":667},{"x":792,"y":647},{"x":798,"y":641},{"x":808,"y":633},{"x":810,"y":631},{"x":812,"y":629}],"stroke":"#f66c00","strokeWidth":4}}
,
        {"tag":2,"wbNumber":"1556246232493"}
,
        {"tag":14,"wbNumber":"1556246232493","pageNum":2}
,
        {"tag":6,"wbNumber":"1556246232493","pageNum":2,"vScrollOffset":0.5}
    ];
    eBoardRef.current.recovery(messages);
},4000);


ReactDOM.render(
  [<EBoard key={"1"} ref={eBoardRef1} onMessageListener={onMessage}/>,<button key={"2"} onClick={addImages} style={{position:"absolute",top:100}}>图片组</button>],
  document.getElementById('root') as HTMLElement
);

ReactDOM.render(
    <EBoard ref={eBoardRef} disabled={false}/>,
    document.getElementById('child') as HTMLElement
);

registerServiceWorker();