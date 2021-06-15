import OmokChat from "../OmokChat";
import RoomListview from "../RoomListview";
import {makeStyles} from "@material-ui/core";
import React from "react";
import {OmokHeader} from "../OmokHeader";
import {appBarHeight} from "../../../common/components/constants";
import {Route, Switch} from "react-router-dom";
import {GameProvider} from "../../js/game";
import OmokRoom from "./OmokRoom";
import {RoomListProvider} from "../RoomListProvider";
import {useQuery} from "@apollo/client";
import {FETCH_ROOMS} from "../../js/graphql";

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
    const {loading, error, data} = useQuery(FETCH_ROOMS);

    if (loading) return "Loading";
    if (error) return "Error";

    return (
        <>
            {/* Nested Routing Applied To Wrap
               ApolloClient and GameProvider to Whole Omok App*/}
            <Switch>
                <Route exact path={'/omok'}>
                    <RoomListProvider
                        rooms={data.rooms ?? []}
                    >
                        <div className={classes.root}>
                            <div className={classes.rooms}>
                                <OmokHeader/>
                                <div className={classes.listView}>
                                    <RoomListview/>
                                </div>
                            </div>
                            <OmokChat
                                title="대기실"
                                room='lobby'
                            />
                        </div>
                    </RoomListProvider>
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

