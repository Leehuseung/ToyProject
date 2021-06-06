import React, {useEffect, useState} from 'react'
import sweetAlert from "sweetalert";
import {socket} from "./socket";


export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export function GameProvider ({ children }) {

    let [turn,setTurn] = useState('B');
    let [userTurn,setUserTurn] = useState('B');

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

    let boardInit = () => {
        let changeBoardArr = [...boardArr];

        for (let i = 0; i < changeBoardArr.length; i++) {
            for (let j = 0; j < changeBoardArr[i].length; j++) {
                changeBoardArr[i][j].status = null;
            }
        }
        setBoardArr(changeBoardArr);
    }

    let isUndefined = (arr,y,x) => {
        return typeof arr[y] !== 'undefined' && typeof arr[y][x] !== 'undefined';
    }

    let isWinner = (y,x) => {

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
            let winner = turn === 'B' ? '흑돌' : '백돌';
            sweetAlert(winner+"이 승리했습니다.", "", "success")
                .then(() => {
                    setTurn('B');
                    boardInit();
                });
        }
    }

    useEffect(() => {
        socket.on('getBoard', (data) => {
            setX(data.x);
            setY(data.y);

            //소켓에서 넘어온 Board 변경
            let changeBoardArr = data.boardArr;

            setBoardArr(changeBoardArr);

            setTurn(data.turn === 'B' ? 'W' : 'B');
        });

        socket.on('setTurn', (data) => {
            //두번째 입장 백돌
            if(data === 2){
                setUserTurn('W');
            }
        });
    },[]);

    useEffect(() => {
        isWinner(y,x);
    },[boardArr]);

    const store = {
        getTurnState: [turn, setTurn],
        boardArr: boardArr,
        userTurn: userTurn
    }

    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}