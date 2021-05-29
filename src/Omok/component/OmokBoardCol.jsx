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
    const { turning } = React.useContext(GameContext);
    const { boardArr } = React.useContext(GameContext);

    let [status,setStatus] = useState(props.status);
    let [stoneStyle,setStone] = useState({});

    let [topColStyle,setTopColStyle] = useState({});
    let [botColStyle,setBotColStyle] = useState({});

    let [turn,setTurn] = turning;

    let hideStoneBackground = () => {
        setTopColStyle({'opacity': 0});
        setBotColStyle({'opacity': 0});
    }

    let hideTopBorder = () => { setTopColStyle({'borderRight':'0px'}) }
    let hideLeftBorder = () => { setTopColStyle({'borderBottom':'0px'}) }

    let hideBottomBorder = () => { setBotColStyle({'borderLeft':'0px'}) }
    let hideRightBorder = () => { setBotColStyle({'borderTop':'0px'}) }

    useEffect(() => {
        if(props.y === 16){
            hideTopBorder();
        }
        if(props.x === 0){
            hideLeftBorder()
        }
        if(props.x === 16){
            hideRightBorder();
        }
        if(props.y === 0){
            hideBottomBorder();
        }
        if(props.x === 0 && props.y === 16){
            setTopColStyle({'borderRight':'0px','borderBottom':'0px'});
        }
        if(props.x === 16 && props.y === 0){
            setBotColStyle({'borderTop':'0px','borderLeft':'0px'});
        }
    },[]);

    let putStone = () => {
        if(status !== null){
            alert('돌 위에 돌을 둘 수 없습니다.');
            return;
        }
        setStatus(!!turn ? 0 : 1);
        setTurn(!!turn ? 0 : 1);
    }

    useEffect(() => {
        let color = '';
        let boxShadow = '';
        if(status){
            color = 'white';
            boxShadow = '2px 2px 2px grey';
            hideStoneBackground();
        }else if (status === 0){
            color = 'black';
            boxShadow = '2px 2px 2px grey';
            hideStoneBackground();
        }

        setStone({
            'backgroundColor':color,
            'border-radius': '50%',
            'boxShadow' : boxShadow
        });
    }, [status]);

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