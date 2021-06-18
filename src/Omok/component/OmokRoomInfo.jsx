import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect} from "react";
import Button from '@material-ui/core/Button';
import {GameContext} from '../js/game';
import {socket} from "../js/socket";

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

export default function OmokRoomInfo(props){
    const { getRoomUserInfo,  setIsAllReady, getUserRole, getGameStatusText } = React.useContext(GameContext);
    const classes = useStyles();

    let [roomUserInfo,setRoomUserInfo] = getRoomUserInfo;
    let [userRole] = getUserRole;
    let [gameStatusText, setGameStatusText] = getGameStatusText;



    useEffect(() => {
        socket.on('changeReady',(data) => {
            setRoomUserInfo(data);
        });
    },[setRoomUserInfo]);

    useEffect(() => {
        if(roomUserInfo.host.isReady && roomUserInfo.guest.isReady){
            let time = 5;
            setGameStatusText('게임을 시작합니다..'+ time + '초');
            let timerId = setInterval(() => {
                setGameStatusText('게임을 시작합니다..'+ (--time)+ '초');
            },1000);

            setTimeout(() => {
                clearInterval(timerId);
                setIsAllReady(true);

                if(roomUserInfo.host.stone === 'B'){
                    setGameStatusText(`${roomUserInfo.host.userId}의 차례입니다.`);
                } else {
                    setGameStatusText(`${roomUserInfo.guest.userId}의 차례입니다.`);
                }


            }, 5000);

        }
    },[roomUserInfo,setGameStatusText,setIsAllReady]);

    let readyEvent = (role) => {
        return () => {
            if(role === userRole){
                let changeRoomUserInfo =  Object.assign({}, roomUserInfo);

                if(changeRoomUserInfo[role].isReady){
                    changeRoomUserInfo[role].isReady = false;
                } else {
                    changeRoomUserInfo[role].isReady = true;
                }

                socket.emit('emitRoomUserInfo', {
                    room : props.id,
                    changeRoomUserInfo : changeRoomUserInfo
                });
            }
        };
    }


    return(
        <>
            <div className={classes.roomWrapper}>
                <div className="host" style={{'textAlign':'center'}}>
                    {roomUserInfo.host.userId + '(방장)'}
                    <Button style={{marginLeft:'20px'}}
                            variant="contained"
                            color = {roomUserInfo.host.isReady ? 'primary' : 'default'}
                            onClick={readyEvent('host')}
                    >
                        준비
                    </Button>
                </div>
                <div className="guest" style={{'textAlign':'center'}}>
                    {roomUserInfo.guest.userId}
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