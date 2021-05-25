import {useState, useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useChatting} from "../js/hooks";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        border: "3px solid black",
        height: "90vh",
        minHeight : '100px',
        overflow: "auto"
    },
    chatArea: {
        padding: 10,
        backgroundColor: "white",
        flex: 1,
        whiteSpace: "pre-line",
    },
    chatInput: {
        display: "flex",
        flexDirection: "row",
    },
    textArea: {
        flex: 1
    },
    inputButton: {}
}));

export default function OmokChat(props) {
    const classes = useStyles();
    const id = useRef(Math.floor(Math.random() * 100));

    const [logs, sendMessage] = useChatting(id.current, props.room);
    const [inputText, setInputText] = useState('');

    useEffect(()=>{
        setInputText('');
    },[logs])

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
            </div>
            <div className={classes.chatInput}>
                <textarea
                    className={classes.textArea}
                    value={inputText}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                />
                <button className={classes.inputButton}
                        onClick={()=>sendMessage(inputText)}
                >
                    Enter
                </button>
            </div>
        </div>
    );
}
