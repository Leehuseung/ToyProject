import {makeStyles} from '@material-ui/core/styles';
import OmokChat from "./OmokChat";
import {useGameRoom} from "../js/hooks";
import {appBarHeight} from "../../common/components/constants";
import OmokBoardRow from './OmokBoardRow.jsx';
import React from "react";
import {GameContext} from '../js/game';
import {useParams} from 'react-router-dom';

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
        minWidth: '500px',
        minHeight: '820px',
        overflow: "auto",
        maxHeight: `calc(100vh - ${appBarHeight}px)`
    },
    omokBoard: {
        backgroundColor: '#FFC078',
        width: '495px',
        height: '495px',
        border: '1px solid black',
        margin: '0 auto'
    },
    omokTop: {
        height: '100px'
    },
    boardRow: {
        height: '29px'
    }
});

export default function OmokRoom() {
    const classes = useStyles();
    const {id} = useParams();
    const {loading, error, room} = useGameRoom(id);
    const {boardArr} = React.useContext(GameContext);

    if (loading) return <>Loading...</>
    if (error) return <>Error...{error.toString()}</>

    if (room) {
        return (
            <div className={classes.root}>
                <div className={classes.rooms}>
                    <div className={classes.omokTop}></div>
                    <div className={classes.omokBoard}>
                        {
                            boardArr.map(
                                row => <OmokBoardRow row={row}/>
                            )
                        }
                    </div>
                </div>
                <OmokChat
                    title={room.title}
                    room={id}
                />
            </div>
        );
    } else {
        return <>This room is currently not available!</>;
    }
}