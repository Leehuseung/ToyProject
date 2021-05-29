import {makeStyles} from "@material-ui/core/styles";
import React,{useState,useEffect} from "react";
import {OmokRoom} from './OmokRoom';
import {GameContext} from '../js/game';

const useStyles = makeStyles({
    boardCol: {
        width: '29px',
        height: '30px',
        display: 'inline-block',
        '&:hover': {
            backgroundColor: '#FD7E14'
        },
        cursor: 'pointer'
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
    const { turning,boardArr,setBoardArr } = React.useContext(GameContext);

    let [status,setStatus] = useState(props.status);
    let [stoneStyle,setStone] = useState({});

    let [topColStyle,setTopColStyle] = useState({});
    let [botColStyle,setBotColStyle] = useState({});

    let [turn,setTurn] = turning;

    let hideStoneBackground = (status) => {
        if(status == null){
            setTopColStyle({'opacity': 1});
            setBotColStyle({'opacity': 1});
        } else {
            setTopColStyle({'opacity': 0});
            setBotColStyle({'opacity': 0});
        }

    }

    let ShowStoneBackground = () => {
        setTopColStyle({'opacity': 1});
        setBotColStyle({'opacity': 1});
    }

    let hideTopBorder = () => { setTopColStyle({'borderRight':'0px'}) }
    let hideLeftBorder = () => { setTopColStyle({'borderBottom':'0px'}) }

    let hideBottomBorder = () => { setBotColStyle({'borderLeft':'0px'}) }
    let hideRightBorder = () => { setBotColStyle({'borderTop':'0px'}) }

    //omok board ui init
    useEffect(() => {
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
    },[]);

    let isUndefined = (arr,y,x) => {
        if(typeof arr[y] != 'undefined' && typeof arr[y][x] != 'undefined'){
            return true;
        }else {
            return false;
        }
    }

    let boardInit = () => {
        let changeBoardArr = [...boardArr];

        for (let i = 0; i < changeBoardArr.length; i++) {
            for (let j = 0; j < changeBoardArr[i].length; j++) {
                changeBoardArr[i][j].status = null;
            }
        }
        setBoardArr(changeBoardArr);
    }

    useEffect(() => {
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
    },[]);

    let isWinner = (y,x) => {

        let count = 1;

        let right = x;
        for (let i = 1; i < 5; i++) {
            if(isUndefined(boardArr,y,right+1) && boardArr[y][++right].status == turn){
                count++;
            } else {
                break;
            }
        }

        let left = x;
        for (let i = 1; i < 5; i++) {
            if(isUndefined(boardArr,y,left-1) && boardArr[y][--left].status == turn){
                count++;
            } else {
                break;
            }
        }

        let top = y;
        let bottom = y;
        if(count < 5){
            count = 1;

            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,top+1,x) && boardArr[++top][x].status == turn){
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,bottom-1,x) && boardArr[--bottom][x].status == turn){
                    count++;
                } else {
                    break;
                }
            }
        }

        if(count < 5){
            count = 1;

            left = x;
            top = y;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,top+1,left+1) && boardArr[++top][++left].status == turn){
                    count++;
                } else {
                    break;
                }
            }

            right = x;
            bottom = y;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,bottom-1,right-1) && boardArr[--bottom][--right].status == turn){
                    count++;
                } else {
                    break;
                }
            }
        }


        if(count < 5){
            count = 1;

            left = x;
            top = y;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,top+1,left-1) && boardArr[++top][--left].status == turn){
                    count++;
                } else {
                    break;
                }
            }

            right = x;
            bottom = y;
            for (let i = 1; i < 5; i++) {
                if(isUndefined(boardArr,bottom-1,right+1) && boardArr[--bottom][++right].status == turn){
                    count++;
                } else {
                    break;
                }
            }
        }

        if(count >= 5){
            let winner = turn == 'B' ? '흑돌' : '백돌';

            boardInit();
            setTurn('B');
            alert(`${winner}이 승리했습니다.`);
        }

    }

    let putStone = () => {
        if(props.status !== null){
            alert('돌 위에 돌을 둘 수 없습니다.');
            return;
        }

        let changeBoardArr = [...boardArr];

        changeBoardArr[props.y][props.x].status = turn == 'B' ? 'B' : 'W';
        setBoardArr(changeBoardArr);
        isWinner(props.y,props.x);

        setTurn(turn == 'B' ? 'W' : 'B');
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

        setStone({
            'backgroundColor':color,
            'border-radius': '50%',
            'boxShadow' : boxShadow
        });

    }, [boardArr]);

    return(
        <div className={classes.boardCol}
             onClick={putStone}
             style={stoneStyle}
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