import {useMutation} from "@apollo/client";
import {CREATE_ROOM, DELETE_ROOM} from "../graphql";


export function useUpdateRoom() {
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
