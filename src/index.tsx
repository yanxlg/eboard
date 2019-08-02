// import {RefObject} from 'react';
import {RefObject} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {EBoard} from './EBoard';
import registerServiceWorker from './registerServiceWorker';
import {MessageTag} from './enums/MessageTag';

// let promise = new Promise((resolve)=>{setTimeout(()=>{resolve()},5000)});

// const eBoardRef:RefObject<EBoard> = React.createRef();
const eBoardRef1:RefObject<EBoard> = React.createRef();


function onMessage(message:string){
    console.log(message);
    // 延迟5s + random()[0-2]s 处理，通过promise来处理
    // eBoardRef.current.dispatchMessage(JSON.parse(message) as any,0,true);
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
   let a = {"message":"success","status":"000000000","result":["{\"whiteboardBodyModel\":{\"images\":[\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/0.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/1.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/2.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/3.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/4.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/5.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/6.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/7.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/8.png\",\"https://reserver.edukuo.cn:8445/resource2/1000/document/20190802/d01689db5f0c4feea12625718f1e9cb2_png/9.png\"],\"pageNum\":1,\"wbName\":\"第七讲.doc\",\"wbNumber\":\"1564713526485\",\"wbType\":\"images\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-2\",\"name\":\"whiteboard_create_board\",\"sendType\":\"CP2A\",\"timestamp\":1564713526536,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"pageNum\":1,\"vScrollOffset\":0.46922642574816487,\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-8\",\"name\":\"whiteboard_scroll_board\",\"sendType\":\"CP2A\",\"timestamp\":1564713764329,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1315,\"y\":2239},{\"x\":1315,\"y\":2239},{\"x\":1315,\"y\":2238},{\"x\":1317,\"y\":2238},{\"x\":1322,\"y\":2238},{\"x\":1331,\"y\":2239},{\"x\":1337,\"y\":2239},{\"x\":1404,\"y\":2242},{\"x\":1424,\"y\":2242},{\"x\":1435,\"y\":2242},{\"x\":1450,\"y\":2242},{\"x\":1467,\"y\":2244},{\"x\":1472,\"y\":2244},{\"x\":1479,\"y\":2244},{\"x\":1496,\"y\":2245},{\"x\":1507,\"y\":2247},{\"x\":1513,\"y\":2247},{\"x\":1519,\"y\":2247},{\"x\":1556,\"y\":2245},{\"x\":1565,\"y\":2245},{\"x\":1596,\"y\":2245},{\"x\":1600,\"y\":2245},{\"x\":1608,\"y\":2245},{\"x\":1610,\"y\":2245}]},\"objectId\":\"ds_111_1564713094215\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-17\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713786051,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":298,\"y\":2319},{\"x\":298,\"y\":2319},{\"x\":300,\"y\":2319},{\"x\":300,\"y\":2317},{\"x\":301,\"y\":2319},{\"x\":333,\"y\":2320},{\"x\":355,\"y\":2322},{\"x\":373,\"y\":2322},{\"x\":393,\"y\":2322},{\"x\":405,\"y\":2322},{\"x\":416,\"y\":2320},{\"x\":467,\"y\":2317},{\"x\":474,\"y\":2317},{\"x\":520,\"y\":2319},{\"x\":536,\"y\":2322},{\"x\":546,\"y\":2322},{\"x\":559,\"y\":2325},{\"x\":562,\"y\":2326},{\"x\":565,\"y\":2326},{\"x\":572,\"y\":2328},{\"x\":575,\"y\":2328},{\"x\":577,\"y\":2328},{\"x\":585,\"y\":2329},{\"x\":588,\"y\":2329},{\"x\":588,\"y\":2331}]},\"objectId\":\"ds_111_1564713094216\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-29\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713787881,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":991,\"y\":2314},{\"x\":991,\"y\":2314},{\"x\":994,\"y\":2314},{\"x\":1001,\"y\":2314},{\"x\":1012,\"y\":2314},{\"x\":1020,\"y\":2314},{\"x\":1024,\"y\":2314},{\"x\":1034,\"y\":2314},{\"x\":1040,\"y\":2314},{\"x\":1060,\"y\":2314},{\"x\":1067,\"y\":2314},{\"x\":1081,\"y\":2314},{\"x\":1106,\"y\":2314},{\"x\":1136,\"y\":2314},{\"x\":1144,\"y\":2314},{\"x\":1171,\"y\":2314},{\"x\":1176,\"y\":2314},{\"x\":1199,\"y\":2314},{\"x\":1214,\"y\":2313},{\"x\":1220,\"y\":2313},{\"x\":1222,\"y\":2313},{\"x\":1224,\"y\":2313},{\"x\":1225,\"y\":2313},{\"x\":1227,\"y\":2313},{\"x\":1228,\"y\":2313}]},\"objectId\":\"ds_111_1564713094217\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-42\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713794612,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1263,\"y\":2349},{\"x\":1263,\"y\":2349},{\"x\":1236,\"y\":2381},{\"x\":1222,\"y\":2401},{\"x\":1208,\"y\":2421},{\"x\":1197,\"y\":2437},{\"x\":1197,\"y\":2435},{\"x\":1214,\"y\":2417},{\"x\":1237,\"y\":2394},{\"x\":1240,\"y\":2395},{\"x\":1240,\"y\":2467},{\"x\":1239,\"y\":2499},{\"x\":1242,\"y\":2486}]},\"objectId\":\"ds_111_1564713094218\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-48\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713809886,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1303,\"y\":2368},{\"x\":1303,\"y\":2368},{\"x\":1315,\"y\":2365},{\"x\":1338,\"y\":2362},{\"x\":1351,\"y\":2359},{\"x\":1369,\"y\":2368}]},\"objectId\":\"ds_111_1564713094219\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-50\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713810158,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1305,\"y\":2424},{\"x\":1305,\"y\":2424},{\"x\":1322,\"y\":2424},{\"x\":1335,\"y\":2423},{\"x\":1363,\"y\":2421}]},\"objectId\":\"ds_111_1564713094220\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-52\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713810418,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1337,\"y\":2408},{\"x\":1337,\"y\":2408},{\"x\":1340,\"y\":2412},{\"x\":1348,\"y\":2437},{\"x\":1349,\"y\":2452},{\"x\":1371,\"y\":2457},{\"x\":1389,\"y\":2426},{\"x\":1406,\"y\":2386},{\"x\":1450,\"y\":2290},{\"x\":1450,\"y\":2291},{\"x\":1449,\"y\":2294},{\"x\":1441,\"y\":2313},{\"x\":1446,\"y\":2316},{\"x\":1456,\"y\":2317},{\"x\":1496,\"y\":2311},{\"x\":1469,\"y\":2362},{\"x\":1452,\"y\":2385},{\"x\":1421,\"y\":2424}]},\"objectId\":\"ds_111_1564713094221\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-59\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713811137,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1430,\"y\":2351},{\"x\":1430,\"y\":2351},{\"x\":1438,\"y\":2354},{\"x\":1449,\"y\":2355},{\"x\":1467,\"y\":2360},{\"x\":1490,\"y\":2365},{\"x\":1530,\"y\":2372},{\"x\":1528,\"y\":2375}]},\"objectId\":\"ds_111_1564713094222\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-62\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713811482,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1438,\"y\":2423},{\"x\":1438,\"y\":2423},{\"x\":1475,\"y\":2418},{\"x\":1496,\"y\":2414},{\"x\":1516,\"y\":2414},{\"x\":1531,\"y\":2440},{\"x\":1524,\"y\":2457},{\"x\":1482,\"y\":2492}]},\"objectId\":\"ds_111_1564713094223\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-64\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713811734,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1507,\"y\":2385},{\"x\":1507,\"y\":2385},{\"x\":1499,\"y\":2395},{\"x\":1492,\"y\":2408},{\"x\":1473,\"y\":2441}]},\"objectId\":\"ds_111_1564713094224\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-65\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713811981,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1576,\"y\":2299},{\"x\":1576,\"y\":2299},{\"x\":1580,\"y\":2299},{\"x\":1585,\"y\":2300},{\"x\":1591,\"y\":2303},{\"x\":1605,\"y\":2310},{\"x\":1605,\"y\":2317},{\"x\":1600,\"y\":2320},{\"x\":1594,\"y\":2326},{\"x\":1588,\"y\":2332},{\"x\":1588,\"y\":2336},{\"x\":1590,\"y\":2366},{\"x\":1591,\"y\":2372},{\"x\":1593,\"y\":2375},{\"x\":1613,\"y\":2383},{\"x\":1622,\"y\":2383},{\"x\":1646,\"y\":2394},{\"x\":1643,\"y\":2406},{\"x\":1587,\"y\":2449},{\"x\":1573,\"y\":2450},{\"x\":1574,\"y\":2447},{\"x\":1580,\"y\":2437},{\"x\":1585,\"y\":2432},{\"x\":1619,\"y\":2377}]},\"objectId\":\"ds_111_1564713094225\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-74\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713812851,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1633,\"y\":2288},{\"x\":1633,\"y\":2288},{\"x\":1666,\"y\":2277},{\"x\":1677,\"y\":2276},{\"x\":1678,\"y\":2280},{\"x\":1666,\"y\":2313},{\"x\":1662,\"y\":2336},{\"x\":1657,\"y\":2421},{\"x\":1669,\"y\":2420},{\"x\":1738,\"y\":2401},{\"x\":1752,\"y\":2400},{\"x\":1741,\"y\":2401}]},\"objectId\":\"ds_111_1564713094226\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-80\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713813450,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1691,\"y\":2314},{\"x\":1691,\"y\":2314},{\"x\":1692,\"y\":2314},{\"x\":1697,\"y\":2319},{\"x\":1675,\"y\":2383},{\"x\":1672,\"y\":2366},{\"x\":1672,\"y\":2363},{\"x\":1672,\"y\":2362},{\"x\":1694,\"y\":2363},{\"x\":1714,\"y\":2371},{\"x\":1729,\"y\":2363}]},\"objectId\":\"ds_111_1564713094227\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-85\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713813951,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1747,\"y\":2294},{\"x\":1747,\"y\":2294},{\"x\":1755,\"y\":2294},{\"x\":1778,\"y\":2302},{\"x\":1780,\"y\":2303},{\"x\":1778,\"y\":2305}]},\"objectId\":\"ds_111_1564713094228\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-88\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713814192,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1747,\"y\":2331},{\"x\":1747,\"y\":2331},{\"x\":1757,\"y\":2334},{\"x\":1777,\"y\":2368},{\"x\":1775,\"y\":2378},{\"x\":1773,\"y\":2403},{\"x\":1801,\"y\":2362},{\"x\":1801,\"y\":2359},{\"x\":1807,\"y\":2363},{\"x\":1809,\"y\":2366},{\"x\":1821,\"y\":2355},{\"x\":1829,\"y\":2339},{\"x\":1868,\"y\":2296},{\"x\":1882,\"y\":2299},{\"x\":1893,\"y\":2303},{\"x\":1919,\"y\":2337},{\"x\":1907,\"y\":2375},{\"x\":1847,\"y\":2386},{\"x\":1852,\"y\":2349},{\"x\":1862,\"y\":2310},{\"x\":1875,\"y\":2280},{\"x\":1867,\"y\":2305},{\"x\":1833,\"y\":2409}]},\"objectId\":\"ds_111_1564713094229\",\"pageNum\":1,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-98\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713815135,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"pageNum\":2,\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-99\",\"name\":\"whiteboard_switch_page\",\"sendType\":\"CP2A\",\"timestamp\":1564713826735,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"pageNum\":2,\"vScrollOffset\":0.16939582156973462,\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-102\",\"name\":\"whiteboard_scroll_board\",\"sendType\":\"CP2A\",\"timestamp\":1564713928223,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":612,\"y\":1034},{\"x\":612,\"y\":1034},{\"x\":611,\"y\":1035},{\"x\":609,\"y\":1038},{\"x\":608,\"y\":1038},{\"x\":606,\"y\":1040},{\"x\":603,\"y\":1046},{\"x\":600,\"y\":1049},{\"x\":598,\"y\":1052},{\"x\":594,\"y\":1058},{\"x\":591,\"y\":1074},{\"x\":591,\"y\":1078},{\"x\":594,\"y\":1095},{\"x\":602,\"y\":1116},{\"x\":606,\"y\":1120},{\"x\":617,\"y\":1126},{\"x\":625,\"y\":1127},{\"x\":629,\"y\":1127},{\"x\":635,\"y\":1126},{\"x\":657,\"y\":1116},{\"x\":660,\"y\":1115},{\"x\":666,\"y\":1107},{\"x\":675,\"y\":1078},{\"x\":675,\"y\":1075},{\"x\":675,\"y\":1072},{\"x\":674,\"y\":1060},{\"x\":674,\"y\":1055},{\"x\":672,\"y\":1049},{\"x\":670,\"y\":1046},{\"x\":669,\"y\":1043},{\"x\":666,\"y\":1040},{\"x\":661,\"y\":1035},{\"x\":658,\"y\":1034},{\"x\":628,\"y\":1028},{\"x\":612,\"y\":1037},{\"x\":611,\"y\":1038},{\"x\":611,\"y\":1040}]},\"objectId\":\"ds_111_1564713094230\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-119\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713976880,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":683,\"y\":1113},{\"x\":683,\"y\":1113},{\"x\":681,\"y\":1113},{\"x\":683,\"y\":1113},{\"x\":684,\"y\":1113},{\"x\":687,\"y\":1113},{\"x\":690,\"y\":1115},{\"x\":693,\"y\":1115},{\"x\":703,\"y\":1115},{\"x\":703,\"y\":1116},{\"x\":706,\"y\":1116},{\"x\":709,\"y\":1116},{\"x\":710,\"y\":1116},{\"x\":712,\"y\":1116}]},\"objectId\":\"ds_111_1564713094231\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-123\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713984717,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":678,\"y\":1132},{\"x\":678,\"y\":1132},{\"x\":677,\"y\":1132},{\"x\":680,\"y\":1132},{\"x\":683,\"y\":1130},{\"x\":684,\"y\":1130},{\"x\":687,\"y\":1130},{\"x\":689,\"y\":1130},{\"x\":690,\"y\":1130},{\"x\":693,\"y\":1132},{\"x\":697,\"y\":1132},{\"x\":698,\"y\":1132},{\"x\":700,\"y\":1132},{\"x\":703,\"y\":1132},{\"x\":704,\"y\":1132},{\"x\":706,\"y\":1132},{\"x\":707,\"y\":1132},{\"x\":709,\"y\":1132},{\"x\":712,\"y\":1132},{\"x\":713,\"y\":1132}]},\"objectId\":\"ds_111_1564713094232\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-128\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713986285,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":752,\"y\":1124},{\"x\":752,\"y\":1124},{\"x\":753,\"y\":1124},{\"x\":755,\"y\":1124},{\"x\":756,\"y\":1124},{\"x\":769,\"y\":1124},{\"x\":772,\"y\":1123},{\"x\":778,\"y\":1123},{\"x\":782,\"y\":1121},{\"x\":784,\"y\":1121},{\"x\":785,\"y\":1121},{\"x\":787,\"y\":1121},{\"x\":792,\"y\":1121},{\"x\":798,\"y\":1121},{\"x\":801,\"y\":1121},{\"x\":802,\"y\":1121}]},\"objectId\":\"ds_111_1564713094233\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-135\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713989097,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":857,\"y\":1120},{\"x\":857,\"y\":1120},{\"x\":859,\"y\":1120},{\"x\":860,\"y\":1120},{\"x\":880,\"y\":1120},{\"x\":886,\"y\":1118},{\"x\":888,\"y\":1118},{\"x\":890,\"y\":1118},{\"x\":891,\"y\":1118}]},\"objectId\":\"ds_111_1564713094234\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-139\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713991065,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":853,\"y\":1138},{\"x\":853,\"y\":1138},{\"x\":854,\"y\":1138},{\"x\":856,\"y\":1138},{\"x\":864,\"y\":1136},{\"x\":886,\"y\":1135},{\"x\":891,\"y\":1135},{\"x\":899,\"y\":1135},{\"x\":900,\"y\":1135},{\"x\":902,\"y\":1135}]},\"objectId\":\"ds_111_1564713094235\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-142\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713991664,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":955,\"y\":1129},{\"x\":955,\"y\":1129},{\"x\":957,\"y\":1129},{\"x\":971,\"y\":1130},{\"x\":975,\"y\":1130},{\"x\":986,\"y\":1130},{\"x\":989,\"y\":1130},{\"x\":991,\"y\":1130},{\"x\":992,\"y\":1130},{\"x\":994,\"y\":1130},{\"x\":995,\"y\":1130},{\"x\":998,\"y\":1130},{\"x\":1000,\"y\":1130},{\"x\":1001,\"y\":1130},{\"x\":1003,\"y\":1130}]},\"objectId\":\"ds_111_1564713094236\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-149\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564713994293,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":848,\"y\":1230},{\"x\":848,\"y\":1230},{\"x\":845,\"y\":1228},{\"x\":845,\"y\":1227}]},\"objectId\":\"ds_111_1564713094237\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-150\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714037012,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1030,\"y\":1225},{\"x\":1030,\"y\":1225},{\"x\":1032,\"y\":1225}]},\"objectId\":\"ds_111_1564713094238\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-151\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714038081,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1345,\"y\":1216},{\"x\":1345,\"y\":1216},{\"x\":1345,\"y\":1218},{\"x\":1346,\"y\":1218},{\"x\":1349,\"y\":1218},{\"x\":1354,\"y\":1219},{\"x\":1360,\"y\":1222},{\"x\":1381,\"y\":1219},{\"x\":1386,\"y\":1219},{\"x\":1392,\"y\":1218},{\"x\":1395,\"y\":1216},{\"x\":1398,\"y\":1214},{\"x\":1401,\"y\":1213},{\"x\":1403,\"y\":1211},{\"x\":1409,\"y\":1201},{\"x\":1409,\"y\":1199},{\"x\":1415,\"y\":1182},{\"x\":1420,\"y\":1172},{\"x\":1417,\"y\":1149},{\"x\":1407,\"y\":1135},{\"x\":1406,\"y\":1133},{\"x\":1394,\"y\":1126},{\"x\":1392,\"y\":1124},{\"x\":1377,\"y\":1127},{\"x\":1372,\"y\":1129},{\"x\":1348,\"y\":1141},{\"x\":1345,\"y\":1142},{\"x\":1340,\"y\":1147},{\"x\":1335,\"y\":1152},{\"x\":1331,\"y\":1159},{\"x\":1328,\"y\":1164},{\"x\":1328,\"y\":1165},{\"x\":1351,\"y\":1213},{\"x\":1368,\"y\":1218}]},\"objectId\":\"ds_111_1564713094239\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-167\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714050075,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1522,\"y\":1222},{\"x\":1522,\"y\":1222},{\"x\":1522,\"y\":1224},{\"x\":1541,\"y\":1222},{\"x\":1548,\"y\":1222},{\"x\":1554,\"y\":1222},{\"x\":1562,\"y\":1222},{\"x\":1568,\"y\":1222},{\"x\":1577,\"y\":1222},{\"x\":1580,\"y\":1222},{\"x\":1582,\"y\":1222},{\"x\":1584,\"y\":1222},{\"x\":1584,\"y\":1219}]},\"objectId\":\"ds_111_1564713094240\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-171\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714053121,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":974,\"y\":1319},{\"x\":974,\"y\":1319},{\"x\":972,\"y\":1320},{\"x\":974,\"y\":1320},{\"x\":978,\"y\":1320},{\"x\":981,\"y\":1320},{\"x\":988,\"y\":1320},{\"x\":992,\"y\":1320},{\"x\":995,\"y\":1320},{\"x\":998,\"y\":1322},{\"x\":1000,\"y\":1322},{\"x\":1001,\"y\":1322},{\"x\":1003,\"y\":1322},{\"x\":1004,\"y\":1322},{\"x\":1003,\"y\":1322},{\"x\":1001,\"y\":1322},{\"x\":1000,\"y\":1320},{\"x\":992,\"y\":1320},{\"x\":991,\"y\":1320},{\"x\":988,\"y\":1320},{\"x\":986,\"y\":1320},{\"x\":985,\"y\":1320},{\"x\":983,\"y\":1322},{\"x\":981,\"y\":1322},{\"x\":980,\"y\":1322},{\"x\":978,\"y\":1322},{\"x\":1003,\"y\":1319},{\"x\":1004,\"y\":1317}]},\"objectId\":\"ds_111_1564713094241\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-181\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714064826,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":1037,\"y\":1319},{\"x\":1037,\"y\":1319},{\"x\":1040,\"y\":1320},{\"x\":1041,\"y\":1320},{\"x\":1043,\"y\":1320},{\"x\":1044,\"y\":1320},{\"x\":1046,\"y\":1320},{\"x\":1049,\"y\":1320},{\"x\":1052,\"y\":1322},{\"x\":1070,\"y\":1319},{\"x\":1072,\"y\":1319},{\"x\":1080,\"y\":1319},{\"x\":1083,\"y\":1319},{\"x\":1084,\"y\":1319},{\"x\":1087,\"y\":1320},{\"x\":1090,\"y\":1320},{\"x\":1093,\"y\":1320},{\"x\":1106,\"y\":1320},{\"x\":1116,\"y\":1319},{\"x\":1132,\"y\":1316},{\"x\":1142,\"y\":1314},{\"x\":1145,\"y\":1314},{\"x\":1148,\"y\":1314},{\"x\":1150,\"y\":1312},{\"x\":1152,\"y\":1312}]},\"objectId\":\"ds_111_1564713094242\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-193\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714067486,\"type\":\"WHITEBOARD\",\"userId\":10047}}","{\"whiteboardBodyModel\":{\"attributes\":{\"strokeWidth\":4,\"stroke\":\"#f22500\",\"points\":[{\"x\":608,\"y\":1423},{\"x\":608,\"y\":1423},{\"x\":608,\"y\":1418},{\"x\":608,\"y\":1420},{\"x\":609,\"y\":1420},{\"x\":620,\"y\":1421},{\"x\":623,\"y\":1421},{\"x\":631,\"y\":1420},{\"x\":638,\"y\":1420}]},\"objectId\":\"ds_111_1564713094243\",\"pageNum\":2,\"shapeType\":\"pencil\",\"wbNumber\":\"1564713526485\"},\"whiteboardHeaderModel\":{\"channelId\":\"Channel-3563@codyy.com\",\"id\":\"3563-10047-1564713092907-195\",\"name\":\"whiteboard_draw_shape\",\"sendType\":\"CP2A\",\"timestamp\":1564714086426,\"type\":\"WHITEBOARD\",\"userId\":10047}}"]};
   let messages = a.result.map((msg)=>{
       const {whiteboardBodyModel:body,whiteboardHeaderModel:header} = JSON.parse(msg);
       return  convertMessage({header,body});
   });
   console.log(messages);
    eBoardRef1.current.recovery(messages);
},200);


ReactDOM.render(
  [<EBoard key={"1"} ref={eBoardRef1} onMessageListener={onMessage}/>,<button key={"2"} onClick={addImages} style={{position:"absolute",top:100}}>图片组</button>],
  document.getElementById('root') as HTMLElement
);

/*
ReactDOM.render(
    <EBoard ref={eBoardRef} disabled={true}/>,
    document.getElementById('child') as HTMLElement
);
*/

registerServiceWorker();