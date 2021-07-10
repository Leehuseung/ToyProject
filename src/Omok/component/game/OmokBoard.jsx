import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {appBarHeight} from "../../../common/components/constants";
import {GameContext} from "../../js/game";
import OmokRoomInfo from "./OmokRoomInfo";
import {useParams} from "react-router-dom";
import sweetAlert from "sweetalert";
import {socket} from "../../js/socket";

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
    },
    boardCol: {
        width: '29px',
        height: '29px',
        display: 'inline-block',
        // cursor: 'pointer',
        // '&:hover': {
        //     backgroundColor: '#FD7E14'
        // },
    },
    boardInnerCol_1: {
        width: '15px',
        height:'15px',
        position: 'absolute',
        borderRight: '1px solid black',
        borderBottom: '1px solid black'
    },
    boardInnerCol_2: {
        width: '15px',
        height:'15px',
        position: 'absolute',
        marginTop: '14px',
        marginLeft: '14px',
        borderLeft: '1px solid black',
        borderTop: '1px solid black'
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

function OmokBoardRow (props){
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

function OmokBoardCol(props){
    const classes = useStyles();
    const { turn, boardArr, userTurn, isAllReady, getOtherUserName } = React.useContext(GameContext);

    let [stoneStyle,setStoneStyle] = useState({});
    let [topColStyle,setTopColStyle] = useState({});
    let [botColStyle,setBotColStyle] = useState({});

    const {id} = useParams();

    let hideStoneBackground = (status) => {
        if(status == null){
            setTopColStyle({'opacity': 1});
            setBotColStyle({'opacity': 1});
        } else {
            setTopColStyle({'opacity': 0});
            setBotColStyle({'opacity': 0});
        }
    }

    let hideTopBorder = () => { setTopColStyle({'borderRight':'0px'}) }
    let hideLeftBorder = () => { setTopColStyle({'borderBottom':'0px'}) }

    let hideBottomBorder = () => { setBotColStyle({'borderLeft':'0px'}) }
    let hideRightBorder = () => { setBotColStyle({'borderTop':'0px'}) }

    let putStone = () => {
        if(turn !== userTurn){
            return;
        }else if (!isAllReady){
            return;
        }else if (props.status !== null){
            sweetAlert("돌 위에 돌을 둘 수 없습니다.", "", "warning").then(() => {});
            return;
        }

        let changeBoardArr = [...boardArr];
        changeBoardArr[props.y][props.x].status = turn === 'B' ? 'B' : 'W';

        socket.emit('putStone', {
            room: id,
            turn: turn,
            boardArr: changeBoardArr,
            x: props.x,
            y: props.y,
            name: getOtherUserName()
        });
    }

    useEffect(() => {
        let color = '';
        // let boxShadow = '';
        if(boardArr[props.y][props.x].status === 'W'){
            color = 'white';
            // boxShadow = '2px 2px 2px grey';
            hideStoneBackground(boardArr[props.y][props.x].status);
        }else if (boardArr[props.y][props.x].status === 'B'){
            color = 'black';
            // boxShadow = '2px 2px 2px grey';
            hideStoneBackground(boardArr[props.y][props.x].status);
        } else {
            setTopColStyle({'opacity': 1});
            setBotColStyle({'opacity': 1});
            if(props.y === 16){
                hideBottomBorder();
            }
            if(props.x === 0){
                hideLeftBorder()
            }
            if(props.x === 16){
                hideRightBorder();
            }
            if(props.y === 0){
                hideTopBorder();
            }
            if(props.x === 0 && props.y === 0){
                setTopColStyle({'borderRight':'0px','borderBottom':'0px'});
            }
            if(props.x === 16 && props.y === 16){
                setBotColStyle({'borderTop':'0px','borderLeft':'0px'});
            }
        }

        setStoneStyle({
            'backgroundColor':color,
            'borderRadius': '50%',
            // 'boxShadow' : boxShadow,
        });

    }, [boardArr,props.x,props.y]);

    let changeBackground = (backgroundColor,cursor) => {
        if(isAllReady && turn === userTurn){
            let changeStoneStyle =  Object.assign({}, stoneStyle);
            if(props.status === null){
                changeStoneStyle.backgroundColor = backgroundColor;
                changeStoneStyle.cursor = cursor;
            }
            setStoneStyle(changeStoneStyle);
        }
    }

    let mouseEnter = () => {
        changeBackground('#FD7E14','pointer');
    }

    let mouseLeave = () => {
        changeBackground('#FFC078','default');
    }

    return(
        <div className={classes.boardCol}
             onClick={putStone}
             style={stoneStyle}
             onMouseEnter={mouseEnter}
             onMouseLeave={mouseLeave}
        >
            <div className={classes.boardInnerCol_1}
                 style={topColStyle}
            >
            </div>
            <div className={classes.boardInnerCol_2}
                 style={botColStyle}
            >
            </div>
        </div>
    )
}