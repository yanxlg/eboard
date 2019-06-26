// import {RefObject} from 'react';
import {RefObject} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EBoard} from './EBoard';
import registerServiceWorker from './registerServiceWorker';
import {MessageTag} from './enums/MessageTag';

// let promise = new Promise((resolve)=>{setTimeout(()=>{resolve()},5000)});

const eBoardRef:RefObject<EBoard> = React.createRef();
const eBoardRef1:RefObject<EBoard> = React.createRef();


function onMessage(message:string){
    // 延迟5s + random()[0-2]s 处理，通过promise来处理
    eBoardRef.current.dispatchMessage(JSON.parse(message) as any,0,true);
   /* promise=promise.then(()=>{
        return new Promise((resolve)=>{
            const time = Math.random()*100*2;
           setTimeout(()=>{
               // console.log(JSON.stringify(message));
               eBoardRef.current.dispatchMessage(JSON.parse(message) as any,0,true);
               resolve();
           },time);
        });
    })*/
}

function addImages(){
      const images:string[]=[require("./images/1.jpg"),
           require("./images/2.jpg"),
           require("./images/3.jpg"),
           require("./images/4.jpg"),
           require("./images/5.jpg")];
    eBoardRef1.current.addImages(images,"图片");
}


function convertMessage(msg:any){
    const {header,body} = msg;
    const {name} = header;
    let tag:MessageTag;
    switch (name) {
        case "whiteboard_create_board":
            tag=MessageTag.CreateFrame;
            break;
        case "whiteboard_draw_shape":
            tag=MessageTag.Shape;
            break;
        case "whiteboard_erase_object":
            tag=MessageTag.Delete;
            break;
        case "whiteboard_clear_all":
            tag=MessageTag.Clear;
            break;
        case "whiteboard_pointer_move":
            tag=MessageTag.Cursor;
            break;
        case "whiteboard_undo_redo":
            tag=MessageTag.UndoRedo;
            break;
        case "whiteboard_delete_board":
            tag = MessageTag.RemoveFrame;
            break;
        case "whiteboard_select_board":
            tag=MessageTag.SwitchToFrame;
            break;
        case "whiteboard_switch_page":
            tag=MessageTag.TurnPage;
            break;
        case "whiteboard_scroll_board":
            tag=MessageTag.Scroll;
            break;
        case "whiteboard_transform_object":
            tag=MessageTag.Transform;
            break;
    }
    return Object.assign({tag},body)
}

setTimeout(()=>{
   let a = {"message":"success","status":"000000000","result":['{"whiteboardBodyModel":{"wbNumber":"1561473917429"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-145","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475714063,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561473280385"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-147","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475714744,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561473259178"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-149","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475715881,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561472232036"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-151","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475717319,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561471777223"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-153","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475718015,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561471644395"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-155","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475718794,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561471481765"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-157","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475719770,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561471398180"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-159","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475720875,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561470811124"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-161","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475721976,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"wbNumber":"1561470810933"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-163","name":"whiteboard_delete_board","sendType":"CP2A","timestamp":1561475722956,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"canRemove":true,"wbName":"白板","wbNumber":"1561475723989","wbType":"empty"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-164","name":"whiteboard_create_board","sendType":"CP2A","timestamp":1561475723992,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":176,"y":123},{"x":176,"y":123},{"x":173,"y":391},{"x":173,"y":444},{"x":173,"y":455},{"x":173,"y":457}]},"objectId":"ds_111_1561475124973","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-167","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475743827,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":533,"y":185},{"x":533,"y":185},{"x":847,"y":195}]},"objectId":"ds_111_1561475124974","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-169","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475744752,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":522,"y":388},{"x":522,"y":388},{"x":847,"y":352},{"x":848,"y":351},{"x":850,"y":351}]},"objectId":"ds_111_1561475124975","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-172","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475745582,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":1283,"y":213},{"x":1283,"y":213},{"x":1329,"y":213},{"x":1553,"y":211}]},"objectId":"ds_111_1561475124976","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-174","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475746275,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":1273,"y":375},{"x":1273,"y":375},{"x":1276,"y":375},{"x":1331,"y":375},{"x":1551,"y":337}]},"objectId":"ds_111_1561475124977","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-176","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475746924,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"attributes":{"strokeWidth":12,"stroke":"#00cac4","points":[{"x":1193,"y":565},{"x":1193,"y":565},{"x":1193,"y":567},{"x":1211,"y":567},{"x":1231,"y":567},{"x":1803,"y":513},{"x":1954,"y":504},{"x":1996,"y":496}]},"objectId":"ds_111_1561475124978","shapeType":"pencil","wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-180","name":"whiteboard_draw_shape","sendType":"CP2A","timestamp":1561475747795,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"objectIds":["ds_111_1561475124973"],"wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-181","name":"whiteboard_erase_object","sendType":"CP2A","timestamp":1561475764988,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"objectIds":["ds_111_1561475124978"],"wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-182","name":"whiteboard_erase_object","sendType":"CP2A","timestamp":1561475781485,"type":"WHITEBOARD","userId":7509}}','{"whiteboardBodyModel":{"objectIds":["ds_111_1561475124974"],"wbNumber":"1561475723989"},"whiteboardHeaderModel":{"channelId":"Channel-2959@codyy.com","id":"2959-7509-1561475123376-183","name":"whiteboard_erase_object","sendType":"CP2A","timestamp":1561475782967,"type":"WHITEBOARD","userId":7509}}']};
   
   let messages = a.result.map((msg)=>{
       const {whiteboardBodyModel:body,whiteboardHeaderModel:header} = JSON.parse(msg);
       return  convertMessage({header,body});
   });
   console.log(messages);
    eBoardRef1.current.recovery(messages);
},4000);


ReactDOM.render(
  [<EBoard key={"1"} ref={eBoardRef1} onMessageListener={onMessage}/>,<button key={"2"} onClick={addImages} style={{position:"absolute",top:100}}>图片组</button>],
  document.getElementById('root') as HTMLElement
);

ReactDOM.render(
    <EBoard ref={eBoardRef} disabled={true}/>,
    document.getElementById('child') as HTMLElement
);

registerServiceWorker();