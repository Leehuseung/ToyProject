import {makeStyles} from "@material-ui/core/styles";
import OmokBoardCol from "./OmokBoardCol.jsx";
import React, {useState} from 'react';

const useStyles = makeStyles({
    boardRow: {
        height: '29px'
    }
});

export default function OmokBoardRow (props){
    const classes = useStyles();

    let x = 17;
    let boardColArr = [];

    for (let i = 0; i < x; i++) {
        boardColArr.push(i);
    }

    return(
        <div className={classes.boardRow}>
            {
                boardColArr.map(
                    x => <OmokBoardCol y={props.y} x={x} status={null} turn={props.turn}/>
                )
            }
        </div>
    );
}