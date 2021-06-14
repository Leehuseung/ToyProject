import {useContext, useEffect, useState} from "react";
import {socket} from "./socket";
import {useMutation, useQuery} from "@apollo/client";
import {CREATE_ROOM, FETCH_ROOMS, FETCH_ROOM, DELETE_ROOM} from "./graphql";
import {UserContext} from "../component/pages/OmokHome";


export function useGameUser() {
    const [user, setUser] = useState(null);
    //const url = `${window.location.protocol}//127.0.0.1:8000/omok/session/`;
    const url = `http://49.247.146.76:8000/omok/session/`;
    useEffect(() => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                "sid" : window.sessionStorage.getItem('sid') ?? ''
            })
        }).then(res => {
                res.json().then(response => {
                    window.sessionStorage.setItem('sid', response.id);
                    window.sessionStorage.setItem('name', response.name);
                    setUser({id: response.id, name: response.name});
                }).catch(e => {
                    console.log('Response Error', e);
                })
            }
        ).catch(error => {
            console.log('Fetch Error', error)
        });
    }, [url]);
    return user;
}


export function useGameRoom(id) {
    const {loading, error, data} = useQuery(FETCH_ROOM, {variables: {id: id}});

    if (data) {
        const room = data["room"];
        return {loading, error, room};
    }

    return {loading, error, data};
}

export function useChatting(roomId) {
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
    }, [roomId, user.name]);

    return [log, sendMessage];
}

export function useFetch() {
    const {loading, error, data} = useQuery(FETCH_ROOMS);
    return {loading, error, data};
}

export function useUpdate() {
    const updateRoom = (room) => {
        if (room.id) {
            return add({variables: room});
        } else {
            return add({variables: room})
        }
    }

    const [add] = useMutation(CREATE_ROOM, {
        onCompleted: (data) => {
            console.log('done', data);
        },
        onError: () => {
            console.log('error');
        },
    });


    return updateRoom;
}

export function useDelete() {
    const remove = (id) => deleteRoom({variables: {id: id}});

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
        onError: () => {
            console.log('error');
        },
    });

    return remove;
}
