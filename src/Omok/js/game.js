import React, {useContext, useEffect, useState} from 'react'
import sweetAlert from "sweetalert";
import {socket} from "./socket";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../common/AuthProvider";

export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export function GameProvider ({ children }) {

    const user = useContext(AuthContext).user;
    const {id} = useParams();

    let [turn,setTurn] = useState('B');
    let [userTurn,setUserTurn] = useState('B');
    let [userRole,setUserRole] = useState('host');
    let [isAllReady, setIsAllReady] = useState(false);
    let [gameStatusText, setGameStatusText] = useState('준비');
    let [roomUserInfo,setRoomUserInfo] = useState({
        //초기값
        'host' : {
            name : '',
            stone : 'B',
            isReady : false
        },
        'guest' : {
            name : '',
            stone : 'W',
            isReady : false
        },
    });

    let [x,setX] = useState(0);
    let [y,setY] = useState(0);

    let BOARD_SIZE = 17;
    let arr = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        let colArr = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            colArr.push({
                'axisX': j,
                'axisY': i,
                'status':null
            });
        }
        arr.push(colArr);
    }

    //오목판 status를 배열로 관리
    let [boardArr,setBoardArr] = useState(arr);

    let isUndefined = (arr,y,x) => {
        return typeof arr[y] !== 'undefined' && typeof arr[y][x] !== 'undefined';
    }

    socket.on('getBoard', (data) => {
        setX(data.x);
        setY(data.y);

        if(data.turn === 'W'){
            setGameStatusText(`${roomUserInfo.host.name}의 차례입니다.`);
        } else {
            setGameStatusText(`${roomUserInfo.guest.name}의 차례입니다.`);
        }

        //소켓에서 넘어온 Board 변경
        let changeBoardArr = data.boardArr;

        setBoardArr(changeBoardArr);

        setTurn(data.turn === 'B' ? 'W' : 'B');
    });


    useEffect(() => {
        socket.on('receiveUserStatus',(data) => {
            let changeRoomUserInfo =  Object.assign({}, roomUserInfo);
            changeRoomUserInfo[data.role] = data.roomUserInfo;
            setRoomUserInfo(changeRoomUserInfo);
        });

        socket.on('enterGame',(data) => {
            let role = 'host';
            if(data === 2){
                role = 'guest';
                setUserTurn('W');
                setUserRole(role);
            }
            // changeUser(role,'name',user.name);

            let changeRoomUserInfo =  Object.assign({}, roomUserInfo);

            changeRoomUserInfo[role]['name'] = user.name;
            // setRoomUserInfo(changeRoomUserInfo);
            socket.emit('shareUserStatus',{
                'room' : id,
                'role' : role,
                'roomUserInfo' : changeRoomUserInfo[role]
            });

        });

    },[user,roomUserInfo,id]);

    useEffect(() => {

        let boardInit = () => {

            //오목판 초기화
            let changeBoardArr = [...boardArr];

            for (let i = 0; i < changeBoardArr.length; i++) {
                for (let j = 0; j < changeBoardArr[i].length; j++) {
                    changeBoardArr[i][j].status = null;
                }
            }
            setBoardArr(changeBoardArr);

            //게임에대한 정보 초기화
            setIsAllReady(false);
            setGameStatusText('준비');

            let changeRoomUserInfo =  Object.assign({}, roomUserInfo);

            changeRoomUserInfo.host.isReady = false;
            changeRoomUserInfo.guest.isReady = false;

            setRoomUserInfo(changeRoomUserInfo);
            socket.emit('emitRoomUserInfo',{
                room : id,
                roomUserInfo : changeRoomUserInfo
            })
        }

        const isWinner = (y,x) => {

            let count = 1;

            let right = x;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,y,right+1) && boardArr[y][++right].status === turn){
                    count++;
                } else {
                    break;
                }
            }

            let left = x;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,y,left-1) && boardArr[y][--left].status === turn){
                    count++;
                } else {
                    break;
                }
            }

            let top = y;
            let bottom = y;
            if(count < 5){
                count = 1;

                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,top+1,x) && boardArr[++top][x].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }

                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,x) && boardArr[--bottom][x].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }
            }

            if(count < 5){
                count = 1;

                left = x;
                top = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,top+1,left+1) && boardArr[++top][++left].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }

                right = x;
                bottom = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,right-1) && boardArr[--bottom][--right].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }
            }


            if(count < 5){
                count = 1;

                left = x;
                top = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,top+1,left-1) && boardArr[++top][--left].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }

                right = x;
                bottom = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,right+1) && boardArr[--bottom][++right].status === turn){
                        count++;
                    } else {
                        break;
                    }
                }
            }

            if(count >= 5){

                let alertInfo = {
                    title : roomUserInfo[userRole].stone === turn ? '승리했습니다.' : '패배했습니다.',
                    icon : roomUserInfo[userRole].stone === turn ? 'success' : 'error'
                }

                sweetAlert({title : alertInfo.title ,text : '     ', timer: 2000, icon : alertInfo.icon,button: false})
                    .then(() => {
                        boardInit();
                    });
            }
        }

        isWinner(y,x);
    },[boardArr,x,y,turn,userRole,roomUserInfo,id]);

    const store = {
        getTurnState: [turn, setTurn],
        getRoomUserInfo: [roomUserInfo, setRoomUserInfo],
        getUserRole: [userRole, setUserRole],
        boardArr: boardArr,
        userTurn: userTurn,
        isAllReady : isAllReady,
        setIsAllReady : setIsAllReady,
        getGameStatusText : [gameStatusText, setGameStatusText]
    }

    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}