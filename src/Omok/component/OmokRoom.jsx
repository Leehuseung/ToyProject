import {fade, makeStyles} from '@material-ui/core/styles';
import OmokChat from "./OmokChat";
import {useGameRoom} from "../js/hooks";
import {appBarHeight} from "../../common/components/constants";
import OmokBoardRow from './OmokBoardRow.jsx';
import React,{useState} from "react";
import GameProvider from '../js/game';

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
        maxHeight : `calc(100vh - ${appBarHeight}px)`
    },
    omokBoard: {
        backgroundColor : '#FFC078',
        width:'495px',
        height:'437px',
        border:'1px solid black',
        margin: '0 auto'
    },
    omokTop: {
        height: '100px'
    },
    boardRow: {
        height: '29px'
    }
});

export default function OmokRoom(props) {
    const classes = useStyles();

    const room = useGameRoom(props.id);

    if(room===null) {
        return <>Loading...</>
    }

    let y = 14;
    let boardRowArr = [];

    for (let i = y; i >= 0; i--) {
        boardRowArr.push(i);
    }



    return (
            <div className={classes.root}>
                <div className={classes.rooms}>
                    <div className={classes.omokTop}></div>
                    <GameProvider>
                            <div className={classes.omokBoard}>
                            {
                                boardRowArr.map(
                                    y => <OmokBoardRow y={y}/>
                                )
                            }
                        </div>
                    </GameProvider>
                </div>
                <OmokChat
                    title={room.title}
                    room={props.id}
                />
            </div>
    );
}