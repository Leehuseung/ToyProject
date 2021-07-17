import {useState, useContext, useEffect} from "react";
import {socket} from "../socket";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../../common/AuthProvider";
import sweetAlert from "sweetalert";

export default function useOmokRoomInfo() {

    const user = useContext(AuthContext).user;
    const {id} = useParams();

    let [roomUserInfo,setRoomUserInfo] = useState({});
    let [gameStatusText, setGameStatusText] = useState('준비');
    let [isAllReady, setIsAllReady] = useState(false);

    useEffect(() => {

        let intervalGameText;

        let setTurnText = (userName) => {
            socket.off('clearTimeout');

            let timeLimit = 60;

            setGameStatusText(userName+'의 차례입니다. (' + (timeLimit--)+')');

            intervalGameText = setInterval(() => {

                if(timeLimit < 0) {
                    clearInterval(intervalGameText);
                }else if(timeLimit === 0){
                    timeLimit--;
                    let alertInfo = {
                        title : userName === user.name ? '패배했습니다.' : '승리했습니다.',
                        icon : userName === user.name ?  'error' : 'success'
                    }
                    sweetAlert({title : alertInfo.title ,text : '     ', timer: 2000, icon : alertInfo.icon,button: false})
                        .then(() => {
                            socket.emit('endGame',{
                                room : id
                            });
                        });
                } else {
                    setGameStatusText(userName+'의 차례입니다. (' + (timeLimit--)+')');
                }
            },1000);

            socket.on('clearTimeout',() => {
                clearInterval(intervalGameText);
            });
        };

        socket.on('changeRoomInfo',(data) => {
            setRoomUserInfo(data);
        });

        socket.on('gameStart',(data) => {
            setTurnText(roomUserInfo[data.role].name);
            setIsAllReady(true);
        });

        socket.on('setGameText',(data) => {
            setTurnText(data.name);
        });

        socket.on('initOmokUserInfo',(data) => {
            setIsAllReady(false);
            setGameStatusText('준비');
            setRoomUserInfo(data);
        });

        if(typeof roomUserInfo.host !== 'undefined' && typeof roomUserInfo.guest !== 'undefined' && roomUserInfo.host.isReady &&  roomUserInfo.guest.isReady ){
            socket.emit('allReady', {
                'room' : id,
                'role' : (typeof roomUserInfo.host !== 'undefined' && roomUserInfo.host.name === user.name) ? 'host' : 'guest'
            });
        }
        return ()=> {
            socket.off('changeRoomInfo');
            socket.off('gameStart');
            socket.off('initOmokUserInfo');
            socket.off('gameBoardStart');
            socket.off('setGameText');
            socket.off('clearTimeout');
            clearInterval(intervalGameText);
        }
    },[roomUserInfo,id,user]);

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

    return {
        roomUserInfo : roomUserInfo,
        gameStatusText : gameStatusText,
        isAllReady : isAllReady,
        getUserRole : getUserRole,
        getOtherUserName : getOtherUserName,
    };
}
