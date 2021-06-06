import {useEffect, useState} from "react";
import {User} from "./models";
import {chatSocket} from "./socket";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_ROOM, FETCH_ROOMS, FETCH_ROOM, DELETE_ROOM} from "./graphql";

export function useGameRoom(id) {
    const {loading, error, data} = useQuery(FETCH_ROOM, {variables: {id: id}});

    if (data) {
        const room = data["room"];
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
    const updateRoom = (room) => {
        if (room.id) {
            return add({variables: {input: room}});
        } else {
            return add({variables: {input: room}})
        }
    }

    const [add] = useMutation(CREATE_ROOM, {
        onCompleted: (data) => {
            console.log('done', data);
        },
        onError : () => {
            console.log('error');
        },
    });


    return updateRoom;
}

export function useDelete() {
    const remove = (id) => deleteRoom({variables: {id:id}});

    const [deleteRoom] = useMutation(DELETE_ROOM, {
        update: (cache, {data: {deleteRoom}}) => {
            cache.evict({fieldName: "notifications", broadcast: false});
            cache.modify({
                fields: {
                    rooms(existing, {readField}) {
                        console.log(existing.results);
                        //return existing.filter((t) => readField('id', t) !== deleteRoom.id);
                    }
                },
            });
        },
        onCompleted: (data) => {
            console.log('done', data);
        },
        onError : () => {
            console.log('error');
        },
    });

    return remove;
}
