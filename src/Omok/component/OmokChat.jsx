import React, {useState, useEffect, useRef} from "react";
import {fade, makeStyles} from "@material-ui/core/styles";
import {useChatting} from "../js/hooks";
import InputBase from "@material-ui/core/InputBase";
import {appBarHeight} from "../../common/components/constants";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: '100px',
        overflow: "auto",
        maxHeight : `calc(100vh - ${appBarHeight}px)`
    },
    chatArea: {
        borderRadius: theme.shape.borderRadius,
        border: "3px solid black",
        padding: 10,
        backgroundColor: "white",
        flexGrow: 1,
        whiteSpace: "pre-line",
        overflow : 'scroll',
        maxHeight : `calc(100vh - ${appBarHeight}px - 100px)`
    },
    chatInput: {
        marginTop : "10px",
        border: "3px solid black",
        position: 'relative',
        bottom: 0,
        right: 0,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        color : "inherit",
        padding: theme.spacing(1, 1, 1, 1),
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

export default function OmokChat(props) {
    const classes = useStyles();
    const bottomRef = useRef();
    const id = useRef(Math.floor(Math.random() * 100));
    const [logs, sendMessage] = useChatting(id.current, props.room);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        bottomRef.current.scrollIntoView({
            behavior: "auto",
            block: "nearest",
        });
        setInputText('');
    }, [logs])

    const onChange = (e) => {
        if (e.target.value !== '\n') {
            setInputText(e.target.value);
        }
    }

    const handleKeyPress = (evt) => {
        if (evt.key === 'Enter') {
            sendMessage(inputText);
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.chatArea}>
                <h2>{props.title}</h2>
                <span>{logs}</span>
                <div ref = {bottomRef} className='last'></div>
            </div>
            <InputBase
                className={classes.chatInput}
                inputProps={{'aria-label': 'search'}}
                value={inputText}
                onChange={onChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
}
