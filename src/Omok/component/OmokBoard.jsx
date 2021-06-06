import OmokBoardRow from "./OmokBoardRow";
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {appBarHeight} from "../../common/components/constants";
import {GameContext} from "../js/game";
import {socket} from "../js/socket";

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
        height: '100px'
    },
    boardRow: {
        height: '29px'
    }
});

export default function OmokBoard(props){
    const classes = useStyles();
    const { getTurnState,boardArr,setBoardArr } = React.useContext(GameContext);
    let [turn,setTurn] = getTurnState;

    useEffect(() => {
        socket.on('getBoard', (data) => {
            console.log('data',data);
            setTurn(data.turn === 'B' ? 'W' : 'B');

            let changeBoardArr = [...boardArr];
            //소켓에서 넘어온 board로 변경이
            changeBoardArr = data.boardArr;
            setBoardArr(changeBoardArr);

        });
    },[]);



    return (
        <div className={classes.rooms}>
            <div className={classes.omokTop}></div>
            <div className={classes.omokBoard}>
                {
                    boardArr.map(
                        row => <OmokBoardRow row={row} id={props.id}/>
                    )
                }
            </div>
        </div>
    );


}