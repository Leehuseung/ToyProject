import {Room, User} from "../js/models";
import OmokChat from "./OmokChat";
import RoomListview from "./RoomListview";
import {makeStyles} from "@material-ui/core";
import React, {useMemo, useState} from "react";
import {OmokHeader} from "./OmokHeader";
import {appBarHeight} from "../../common/components/constants";

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridGap: "30px",
        margin: '30px',
        overflow: 'auto',
    },
    rooms: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: 300,
        minHeight: '100px',
        overflow: "auto",
        maxHeight : `calc(100vh - ${appBarHeight}px)`
    },
    listView: {
        flex: 1,
        overflow : 'scroll',
        maxHeight : `calc(100vh - ${appBarHeight}px - 100px)`
    },
});

export default function OmokMain() {
    const rooms = useMemo(() => {
        let rooms = []
        for (let i = 0; i < 20; i++) {
            rooms.push(
                Room(
                    i,
                    i % 2 ? 'gogo gogo yo' : 'omok gg yo',
                    User(i, `guest${i}`),
                    i % 2,
                    i % 2
                )
            )
        }
        return rooms;
    }, []);

    const classes = useStyles();
    const [roomList, setRooms] = useState(rooms);

    const onStateChanged = (status) => {
        if (status === undefined) {
            setRooms(rooms);
        } else if (status) {
            setRooms([...rooms.filter(room => room.isAvailable)]);
        } else {
            setRooms([...rooms.filter(room => !room.isAvailable)]);
        }
    }

    const onSearch = (text) => {
        setRooms([...rooms.filter(room=>room.title.includes(text))]);
    }

    return (
        <>
            <div className={classes.root}>
                <div className={classes.rooms}>
                    <OmokHeader
                        onStateChanged = {onStateChanged}
                        onSearch = {onSearch}
                    />
                    <div className={classes.listView}>
                        <RoomListview rooms={roomList}/>
                    </div>
                </div>
                <OmokChat
                    title="대기실"
                    room='lobby'
                />
            </div>
        </>
    );
}

