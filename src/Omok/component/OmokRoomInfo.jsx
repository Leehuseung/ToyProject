import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect} from "react";
import Button from '@material-ui/core/Button';
import {GameContext} from '../js/game';
import {socket} from "../js/socket";
import {useParams} from "react-router-dom";

const useStyles = makeStyles({
    roomWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        border : '3px solid black',
        padding : '10px',
        borderRadius : '4px',
        width : '495px',
        margin: '0 auto',
        height: '65px'
    },
    readyBtn: {
        margin: '40px'
    },
    gamePlayingTextbox : {
        fontSize: '18px',
        height: '30px',
        border: '3px solid black',
        width: '495px',
        margin: '0 auto',
        fontWeight: 'bold',
        borderRadius: '4px',
        marginTop: '5px',
        textAlign: 'center'
    }
});

export default function OmokRoomInfo(){
    const { getRoomUserInfo, isAllReady ,setIsAllReady, getUserRole, getGameStatusText } = React.useContext(GameContext);
    const classes = useStyles();
    const {id} = useParams();

    let [roomUserInfo,setRoomUserInfo] = getRoomUserInfo;
    let [userRole] = getUserRole;
    let [gameStatusText, setGameStatusText] = getGameStatusText;

    const myStateRef = React.useRef(userRole);
    myStateRef.current = userRole;

    const hostIsReady = React.useRef(userRole);
    hostIsReady.current = roomUserInfo.host.isReady;

    const guestIsReady = React.useRef(userRole);
    guestIsReady.current = roomUserInfo.guest.isReady;


    useEffect(() => {
        socket.on('changeReady',(data) => {
            setRoomUserInfo(data);
        });
        return () => {
            socket.emit('gameLeave',{
                role : myStateRef.current,
                room : id
            })
        }
    },[id,setRoomUserInfo]);

    useEffect(() => {

        if(hostIsReady.current && guestIsReady.current){
            let time = 5;
            setGameStatusText('게임을 시작합니다..'+ time + '초');

            let timerId = setInterval(() => {
                if(hostIsReady.current && guestIsReady.current){
                    setGameStatusText('게임을 시작합니다..'+ (--time)+ '초');

                    if(time === 0){
                        clearInterval(timerId);
                        setIsAllReady(true);
                        if(roomUserInfo.host.stone === 'B'){
                            setGameStatusText(`${roomUserInfo.host.name}의 차례입니다.`);
                        } else {
                            setGameStatusText(`${roomUserInfo.guest.name}의 차례입니다.`);
                        }
                    }

                } else {
                    setGameStatusText('준비');
                    clearInterval(timerId);
                }

            },1000)
        }
    },[roomUserInfo,setGameStatusText,setIsAllReady]);

    let readyEvent = (role) => {
        return () => {
            if(isAllReady){
                return;
            }

            if(role === userRole){
                let changeRoomUserInfo =  Object.assign({}, roomUserInfo);
                changeRoomUserInfo[role].isReady = !changeRoomUserInfo[role].isReady;

                socket.emit('shareUserStatus',{
                    'room' : id,
                    'role' : role,
                    'roomUserInfo' : changeRoomUserInfo[role]
                });

            }
        };
    }


    return(
        <>
            <div className={classes.roomWrapper}>
                <div className="host"
                     style={{'textAlign':'center', 'display' : roomUserInfo.host.name === '' ? 'none' : ''}}
                >
                    {roomUserInfo.host.name + '(방장)'}
                    <Button style={{marginLeft:'20px'}}
                            variant="contained"
                            color = {roomUserInfo.host.isReady ? 'primary' : 'default'}
                            onClick={readyEvent('host')}
                    >
                        준비
                    </Button>
                </div>
                <div className="guest"
                     style={{'textAlign':'center', 'display' : roomUserInfo.guest.name === '' ? 'none' : ''}}
                >
                    {roomUserInfo.guest.name}
                    <Button style={{marginLeft:'20px'}}
                            variant="contained"
                            color = {roomUserInfo.guest.isReady ? 'primary' : 'default'}
                            onClick={readyEvent('guest')}
                    >
                        준비
                    </Button>
                </div>
            </div>
            <div className={classes.gamePlayingTextbox}>
                {gameStatusText}
            </div>
        </>
    )
}