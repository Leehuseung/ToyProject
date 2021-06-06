import OmokChat from "./OmokChat";
import RoomListview from "./RoomListview";
import {makeStyles} from "@material-ui/core";
import React, {useEffect, useMemo, useState} from "react";
import {OmokHeader} from "./OmokHeader";
import {appBarHeight} from "../../common/components/constants";
import {useFetch} from "../js/hooks";
import {Route, Switch} from "react-router-dom";
import {GameProvider} from "../js/game";
import OmokRoom from "./OmokRoom";

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
        maxHeight: `calc(100vh - ${appBarHeight}px)`
    },
    listView: {
        flex: 1,
        overflow: 'scroll',
        maxHeight: `calc(100vh - ${appBarHeight}px - 100px)`
    },
});

export default function OmokMain() {
    const classes = useStyles();
    const [roomList, setRooms] = useState([]);
    const {loading, error, data} = useFetch();

    useEffect(() => {
        if (data) {
            setRooms(data.rooms.results);
        }
    }, [data]);

    const onStateChanged =  (status) => {
        if(data) {
            if (status === undefined) {
                setRooms(data.rooms.results);
            } else if (status) {
                setRooms([...data.rooms.results.filter(room => room.isAvailable)]);
            } else {
                setRooms([...data.rooms.results.filter(room => !room.isAvailable)]);
            }
        }
    }

    const onSearch = (text) => {
        setRooms([...data.rooms.results.filter(room => room.title.includes(text))]);
    }

    if (loading) return "Loading";
    if (error) return "Error";


    return (
        <>
           {/* Nested Routing Applied To Wrap
               ApolloClient and GameProvider to Whole Omok App*/}
            <Switch>
                <Route exact path={'/omok'}>
                    <div className={classes.root}>
                        <div className={classes.rooms}>
                            <OmokHeader
                                onStateChanged={onStateChanged}
                                onSearch={onSearch}
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
                </Route>
                <Route path={`/omok/:id`}>
                    <GameProvider>
                        <OmokRoom/>
                    </GameProvider>
                </Route>
            </Switch>
        </>
    );
}

