import {useContext, useEffect, useState} from "react";
import {socket} from "../socket";
import {UserContext} from "../../component/pages/OmokHome";


export default function useChatting(roomId) {
    const sendMessage = (msg) => {
        if (msg.length > 0) {
            socket.emit('chat', {
                room: roomId,
                name: user.name,
                message: msg,
            });
        }
    };

    const user = useContext(UserContext);
    const [log, addLog] = useState('');

    useEffect(() => {
        console.log('user is: ', {id: user.id, name: user.name});
        socket.emit('join', {room: roomId, name: user.name});

        socket.on('announce', (msg) => {
            addLog(prevState => prevState + `[ ${msg} ]\n`);
        });

        socket.on('res', (data) => {
            addLog(prevState => prevState + `${data.name} : ` + data.message + '\n');
        });

        return () => {
            socket.emit('leave', {room: roomId, name: user.name})
            socket.removeAllListeners();
        }
    }, [roomId, user]);

    return [log, sendMessage];
}
