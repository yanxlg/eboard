import {RefObject} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EBoard} from './EBoard';
import registerServiceWorker from './registerServiceWorker';

let promise = new Promise((resolve)=>{setTimeout(()=>{resolve()},5000)});

const eBoardRef:RefObject<EBoard> = React.createRef();


function onMessage(message:object){
    // 延迟5s + random()[0-2]s 处理，通过promise来处理
    promise=promise.then(()=>{
        return new Promise((resolve)=>{
            const time = Math.random()*100*2;
           setTimeout(()=>{
               // console.log(JSON.stringify(message));
               eBoardRef.current.dispatchMessage(message as any,0);
               resolve();
           },time);
        });
    })
}


ReactDOM.render(
  <EBoard onMessageListener={onMessage}/>,
  document.getElementById('root') as HTMLElement
);

ReactDOM.render(
    <EBoard ref={eBoardRef}/>,
    document.getElementById('child') as HTMLElement
);

registerServiceWorker();