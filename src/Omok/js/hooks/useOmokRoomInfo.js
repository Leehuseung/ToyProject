import {useState, useContext, useEffect} from "react";
import {socket} from "../socket";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../../common/AuthProvider";

export default function useOmokRoomInfo() {

    const user = useContext(AuthContext).user;
    const {id} = useParams();

    let [roomUserInfo,setRoomUserInfo] = useState({});
    let [gameStatusText, setGameStatusText] = useState('준비');
    let [isAllReady, setIsAllReady] = useState(false);

    useEffect(() => {
        socket.on('enterGame',(data) => {
            setRoomUserInfo(data);
        });

        socket.on('changeRoomInfo',(data) => {
            setRoomUserInfo(data);
        });

        socket.on('gameStart',(data) => {
            setTurnText(roomUserInfo[data.role].name);
            setIsAllReady(true);
        });

        socket.on('setGameText',(data) => {
            setGameStatusText(data.name+'의 차례입니다.');
        });

        socket.on('initOmokUserInfo',(data) => {
            setIsAllReady(false);
            setGameStatusText('준비');
            setRoomUserInfo(data);
        });

        if(typeof roomUserInfo.host !== 'undefined' && typeof roomUserInfo.guest !== 'undefined' && roomUserInfo.host.isReady &&  roomUserInfo.guest.isReady ){
            socket.emit('allReady', {
                'room' : id
            });
        }
        return ()=> {
            socket.off('enterGame');
            socket.off('changeRoomInfo');
            socket.off('gameStart');
            socket.off('setGameText');
            socket.off('initOmokUserInfo');
            socket.off('gameBoardStart');
        }
    },[roomUserInfo]);

    let getOtherUserName = () => {
        if(roomUserInfo.host.name === user.name){
            return roomUserInfo.guest.name;
        }
        return roomUserInfo.host.name;
    }

    let getUserRole = () => {
        if(typeof roomUserInfo.host !== 'undefined' && roomUserInfo.host.name === user.name){
            return 'host';
        }
        return 'guest';
    }

    let setTurnText = (userName) => {
        setGameStatusText(userName+ '의 차례입니다.')
    };

    return {
        roomUserInfo : roomUserInfo,
        gameStatusText : gameStatusText,
        isAllReady : isAllReady,
        getUserRole : getUserRole,
        getOtherUserName : getOtherUserName,
    };
}
