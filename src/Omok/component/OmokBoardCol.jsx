import {makeStyles} from "@material-ui/core/styles";
import React,{useState,useEffect} from "react";
import {GameContext} from '../js/game';
import sweetAlert from 'sweetalert';
import {socket} from "../js/socket";

const useStyles = makeStyles({
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

export default function OmokBoardCol(props){
    const classes = useStyles();

    const { getTurnState, boardArr, userTurn, isAllReady } = React.useContext(GameContext);

    let [stoneStyle,setStoneStyle] = useState({});
    let [topColStyle,setTopColStyle] = useState({});
    let [botColStyle,setBotColStyle] = useState({});
    // let [gameStatusText, setGameStatusText] = getGameStatusText;
    // let [roomUserInfo, setRoomUserInfo] = getRoomUserInfo;

    let [turn] = getTurnState;

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
            room: props.id,
            turn: turn,
            boardArr: changeBoardArr,
            x: props.x,
            y: props.y
        });

    }

    useEffect(() => {
        let color = '';
        let boxShadow = '';
        if(boardArr[props.y][props.x].status === 'W'){
            color = 'white';
            boxShadow = '2px 2px 2px grey';
            hideStoneBackground(boardArr[props.y][props.x].status);
        }else if (boardArr[props.y][props.x].status === 'B'){
            color = 'black';
            boxShadow = '2px 2px 2px grey';
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
            'boxShadow' : boxShadow,
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