import React, {useState} from "react";


export const RoomListContext = React.createContext([]);

export const RoomListProvider = ({children, rooms}) => {
    const [roomList, setRoomList] = useState(rooms ?? []);

    const handleStatus = (status) => {
        if (rooms) {
            if (status === undefined) {
                setRoomList(rooms);
            } else if (status) {
                setRoomList([...rooms.filter(room => room.isAvailable)]);
            } else {
                setRoomList([...rooms.filter(room => !room.isAvailable)]);
            }
        }
    }

    const handleSearch = (text) => {
        setRoomList([...rooms.filter(room => room.title.includes(text))]);
    }

    return (
        <RoomListContext.Provider
            value = {{roomList, setRoomList, handleStatus, handleSearch}}
        >
            {children}
        </RoomListContext.Provider>
    )
}