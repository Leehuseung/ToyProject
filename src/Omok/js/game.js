import React, {useEffect, useState} from 'react'


export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export function GameProvider ({ children }) {

    let [turn,setTurn] = useState('B');

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

    const store = {
        getTurnState: [turn, setTurn],
        boardArr: boardArr,
        setBoardArr : setBoardArr
    }

    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}