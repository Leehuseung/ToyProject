import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect,useContext} from "react";
import {GameContext} from '../../js/game';
import {socket} from "../../js/socket";
import {useParams} from "react-router-dom";
import {AuthContext} from "../../../common/AuthProvider";


import OmokRoomUserStatus from "./OmokRoomUserStatus";

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
    const { roomUserInfo, gameStatusText } = React.useContext(GameContext);
    const classes = useStyles();
    const user = useContext(AuthContext).user;
    const {id} = useParams();

    useEffect(() => {

        return () => {
            socket.emit('gameLeave',{
                room : id,
                name : user.name
            })
        }
    },[id,user.name]);

    return(
        <>
            <div className={classes.roomWrapper}>
                <OmokRoomUserStatus roomUserInfo={typeof roomUserInfo.host === 'undefined' ? {} : roomUserInfo.host} role={'host'}/>
                <OmokRoomUserStatus roomUserInfo={typeof roomUserInfo.guest === 'undefined' ? {} : roomUserInfo.guest} role={'guest'}/>
            </div>
            <div className={classes.gamePlayingTextbox}>
                {gameStatusText}
            </div>
        </>
    )
}