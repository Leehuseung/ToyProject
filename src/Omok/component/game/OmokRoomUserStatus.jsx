import Button from '@material-ui/core/Button';
import React from "react";
import {socket} from "../../js/socket";
import {GameContext} from "../../js/game";
import {useParams} from "react-router-dom";

export default function OmokRoomUserStatus(props){

    const { roomUserInfo, getUserRole, isAllReady } = React.useContext(GameContext);
    const {id} = useParams();

    let readyEvent = () => {
        let role = getUserRole();
        if(role === props.role && !isAllReady){
            socket.emit('shareUserStatus',{
                'room' : id,
                'role' : props.role,
                'isReady' : !roomUserInfo[props.role].isReady
            });
        }

        return () => {
        };
    }

    if(typeof props.roomUserInfo['name'] !== 'undefined') {
        let roomUserInfo = props.roomUserInfo;

        return(
            <div className="host">
                {roomUserInfo.name + (props.role === 'host' ? '(방장)' : '')}
                <Button style={{marginLeft:'20px'}}
                        variant="contained"
                        color = {roomUserInfo.isReady ? 'primary' : 'default'}
                        onClick={readyEvent}
                >
                    준비
                </Button>
            </div>
        );
    } else {
        return(
            <>
            </>
        )
    }
}