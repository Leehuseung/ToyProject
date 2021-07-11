import {useState, useEffect} from "react";
import {socket} from "../socket";
import sweetAlert from "sweetalert";
import {useParams} from "react-router-dom";

let isUndefined = (arr,y,x) => {
    return typeof arr[y] !== 'undefined' && typeof arr[y][x] !== 'undefined';
}

export default function UserOmokGameInfo() {

    let BOARD_SIZE = 17;
    let arr = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        let colArr = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            colArr.push({
                'axisX': j,
                'axisY': i,
                'status':null,
                'isNew': false
            });
        }
        arr.push(colArr);
    }

    const {id} = useParams();

    // 오목판 status를 배열로 관리
    let [boardArr,setBoardArr] = useState(arr);
    let [turn,setTurn] = useState('B');
    let [userTurn,setUserTurn] = useState('');

    let [x,setX] = useState(0);
    let [y,setY] = useState(0);

    useEffect(() => {

        let boardInit = () => {
            socket.emit('endGame',{
                room : id
            });
        }

        const isWinner = (y,x) => {
            let putStoneColor = boardArr[y][x].status === null ? 'N' : boardArr[y][x].status;
            let count = 1;

            let right = x;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,y,right+1) && boardArr[y][++right].status === putStoneColor){
                    count++;
                } else {
                    break;
                }
            }

            let left = x;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,y,left-1) && boardArr[y][--left].status === putStoneColor){
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
                    if(isUndefined(boardArr,top+1,x) && boardArr[++top][x].status === putStoneColor){
                        count++;
                    } else {
                        break;
                    }
                }

                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,x) && boardArr[--bottom][x].status === putStoneColor){
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
                    if(isUndefined(boardArr,top+1,left+1) && boardArr[++top][++left].status === putStoneColor){
                        count++;
                    } else {
                        break;
                    }
                }

                right = x;
                bottom = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,right-1) && boardArr[--bottom][--right].status === putStoneColor){
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
                    if(isUndefined(boardArr,top+1,left-1) && boardArr[++top][--left].status === putStoneColor){
                        count++;
                    } else {
                        break;
                    }
                }

                right = x;
                bottom = y;
                for (let i = 1; i < 5; i++) {
                    if(isUndefined(boardArr,bottom-1,right+1) && boardArr[--bottom][++right].status === putStoneColor){
                        count++;
                    } else {
                        break;
                    }
                }
            }

            if(count >= 5){
                let alertInfo = {
                    title : userTurn === putStoneColor ? '승리했습니다.' : '패배했습니다.',
                    icon : userTurn === putStoneColor ? 'success' : 'error'
                }

                sweetAlert({title : alertInfo.title ,text : '     ', timer: 2000, icon : alertInfo.icon,button: false})
                    .then(() => {
                        boardInit();
                    });
            }
        }

        isWinner(y,x);

        socket.on('getBoard', (data) => {
            setX(data.x);
            setY(data.y);
            setTurn(data.turn === 'B' ? 'W' : 'B');
            setBoardArr(data.boardArr);
        });

        socket.on('boardInit',() => {
            //오목판 초기화
            let changeBoardArr = [...boardArr];

            for (let i = 0; i < changeBoardArr.length; i++) {
                for (let j = 0; j < changeBoardArr[i].length; j++) {
                    changeBoardArr[i][j].status = null;
                    changeBoardArr[i][j].isNew = false;
                }
            }
            setBoardArr(changeBoardArr);
            setTurn('B');
        });

        return () => {
            socket.off('getBoard');
            socket.off('boardInit');
        }

    },[userTurn,boardArr,x,y,id]);


    return {
        'boardArr' : boardArr,
        'userTurn' : userTurn,
        'setUserTurn' : setUserTurn,
        'turn' : turn,
    };
}