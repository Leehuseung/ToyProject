import {useEffect, useState} from "react";
import {User} from "./models";
import {chatSocket} from "./socket";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_ROOM, FETCH_ROOMS, FETCH_ROOM, UPDATE_ROOM} from "./graphql";

export function useGameRoom(id) {
    const {loading, error, data} = useQuery(FETCH_ROOM, {variables: {id:id}});

    if(data){
        const room = data["currentRoom"];
        return {loading, error, room};
    }

    return {loading, error, data};
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
            chatSocket.emit('leave', {room: roomId, name: user.name})
            chatSocket.removeAllListeners();
        }
    }, [userId, roomId, user.name]);

    return [log, sendMessage];
}

export function useFetch() {
    const {loading, error, data} = useQuery(FETCH_ROOMS);
    return {loading, error, data};
}

export function useUpdate() {
    const updateRoom = async (room) => {
        if(room.id) {
            await update({variables: {input: JSON.stringify(room)}});
        } else {
            await add({variables: {input: JSON.stringify(room)}});
        }
    }

    const [add] = useMutation(CREATE_ROOM, {
        update: (cache, {data: {room}}) => {
            cache.modify({
                fields: {
                    rooms(existing) {
                        return [...existing, room];
                    }
                },
            });
        },
    });

    const [update] = useMutation(UPDATE_ROOM, {
        update: (cache, {data: {updated}}) => {
            cache.modify({
                fields: {
                    rooms(existing, {readField}) {
                        return existing.map((r) => readField('id', r) === updated.id ? updated : r);
                    }
                },
            });
        },
    });

    return updateRoom;
}