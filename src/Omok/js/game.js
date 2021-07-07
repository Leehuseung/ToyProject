import React, {useEffect} from 'react'
import {socket} from "./socket";
import useOmokRoomInfo from "./hooks/useOmokRoomInfo";
import userOmokGameInfo from "./hooks/userOmokGameInfo";

export const GameContext = React.createContext(null)

//ReactContext를 사용해서 사용자의 턴 flag 게임내 전역으로 관리
export function GameProvider ({ children }) {

    let roomInfoObject = useOmokRoomInfo();
    let gameInfoObject = userOmokGameInfo();

    useEffect(() => {
        socket.on('gameBoardStart',(data) => {
            //host or guest
            let role = roomInfoObject.getUserRole();

            if(role === data.role){
                gameInfoObject.setUserTurn('B');
            } else {
                gameInfoObject.setUserTurn('W');
            }
        });

        return () => {
            socket.off('gameBoardStart');
        }

    },[roomInfoObject,gameInfoObject]);


    const store = {
        roomUserInfo: roomInfoObject.roomUserInfo,
        gameStatusText : roomInfoObject.gameStatusText,
        isAllReady : roomInfoObject.isAllReady,
        getUserRole : roomInfoObject.getUserRole,
        getOtherUserName: roomInfoObject.getOtherUserName,
        boardArr: gameInfoObject.boardArr,
        turn: gameInfoObject.turn,
        userTurn: gameInfoObject.userTurn
    }

    return <GameContext.Provider value={store}>{children}</GameContext.Provider>
}