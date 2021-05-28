
import React, {useState} from 'react'

export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export default ({ children }) => {

    let [turn,setTurn] = useState(1);

    const store = {
        turning: [turn, setTurn]
    }
    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}