import {useEffect, useState} from "react";
import {Room, User} from "./models";
import {chatSocket} from "./socket";

export function useGameRoom(id) {
    const [room, setRoom] = useState(null);
    useEffect(()=>{
        ///fetch room
        setRoom(Room(id, '초보만'));
    },[id]);

    return room;
}

export function useChatting(userId, roomId) {
    const sendMessage = (msg) => {
        if (msg.length > 0) {
            chatSocket.emit('chat', {
                room: roomId,
                name: user.name,
                message: msg,
            });
        }
    };

    const [user, setUser] = useState(User(userId, `Guest ${userId}`));
    const [log, addLog] = useState('');

    useEffect(() => {
        setUser(User(userId, `Guest ${userId}`));
        chatSocket.emit('join', {room: roomId, name: user.name});

        chatSocket.on('announce', (msg) => {
            addLog(prevState => prevState + `[ ${msg} ]\n`);
        });

        chatSocket.on('res', (data) => {
            addLog(prevState => prevState + `${data.name} : ` + data.message + '\n');
        });

        return () => {
            chatSocket.emit('leave', {room:roomId, name: user.name})
            chatSocket.removeAllListeners();
        }
    }, [userId, roomId, user.name]);
    
    return [log, sendMessage];
}