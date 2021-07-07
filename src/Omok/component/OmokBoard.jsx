import OmokBoardRow from "./OmokBoardRow";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {appBarHeight} from "../../common/components/constants";
import {GameContext} from "../js/game";
import OmokRoomInfo from "./OmokRoomInfo";

const useStyles = makeStyles({
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
        marginBottom: '15px'
    },
    boardRow: {
        height: '29px'
    }
});

export default function OmokBoard(props){
    const classes = useStyles();
    const { boardArr } = React.useContext(GameContext);

    return (
        <div className={classes.rooms}>
            <div className={classes.omokTop}>
                <OmokRoomInfo/>
            </div>
            <div className={classes.omokBoard}>
                {
                    boardArr.map(
                        row => <OmokBoardRow key={row[0].axisY} row={row} id={props.id}/>
                    )
                }
            </div>
        </div>
    );


}