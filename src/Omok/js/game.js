
import React, {useState} from 'react'

export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export default ({ children }) => {

    let [turn,setTurn] = useState(1);

    let BOARD_SIZE = 17;
    let boardArr = [];
    for (let i = BOARD_SIZE-1; i >= 0; i--) {
        let colArr = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            colArr.push({
                'axisX': j,
                'axisY': i,
                'status':null
            });
        }
        boardArr.push(colArr);
    }


    const store = {
        turning: [turn, setTurn],
        boardArr: boardArr
    }



    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}