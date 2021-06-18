import {makeStyles} from "@material-ui/core/styles";
import OmokBoardCol from "./OmokBoardCol.jsx";
import React from 'react';

const useStyles = makeStyles({
    boardRow: {
        height: '29px'
    }
});

export default function OmokBoardRow (props){
    const classes = useStyles();

    return(
        <div className={classes.boardRow}>
            {
                props.row.map(
                    row => <OmokBoardCol key={row.axisX} x={row.axisX} y={row.axisY}  status={row.status} id={props.id}/>
                )
            }
        </div>
    );
}