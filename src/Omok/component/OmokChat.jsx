import {useState, useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useChatting} from "../js/hooks";

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        border: "3px solid black",
        height: "90vh",
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
        console.log(evt.key);
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
/*
export default function OmokChat(props) {
    const classes = useStyles();
    const id = useRef(Math.floor(Math.random() * 100));
    const [user, setUser] = useState(User(id.current, `Guest ${id.current}`));

    const [inputText, setInputText] = useState('');
    const [textdiv, setTextDiv] = useState('');

    useEffect(() => {
        setUser(User(id.current, `Guest ${id.current}`));
        chatSocket.emit('join', {room: props.room, name: user.name});

        chatSocket.on('announce', (msg) => {
            setTextDiv(prevState => prevState + `[ ${msg} ]\n`);
        });

        chatSocket.on('res', (data) => {
            setTextDiv(prevState => prevState + `${data.name} : ` + data.message + '\n');
            setInputText('');
        });

        return () => {
            chatSocket.emit('leave', {room:props.room, name: user.name})
            chatSocket.removeAllListeners();
        }
    }, [user.name, props.room]);

    const sendMessage = () => {
        if (inputText.length > 0) {
            chatSocket.emit('chat', {
                room: props.room,
                name: user.name,
                message: inputText,
            });
        }
    }

    const onChange = (e) => {
        if (e.target.value !== '\n') {
            setInputText(e.target.value);
        }
    }

    const handleKeyPress = (evt) => {
        if (evt.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={classes.container}>
            <div className={classes.chatArea}>
                <h2>{props.title}</h2>
                <span>{textdiv}</span>
            </div>
            <div className={classes.chatInput}>
                <textarea
                    className={classes.textArea}
                    value={inputText}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                />
                <button className={classes.inputButton}
                        onClick={sendMessage}
                >
                    Enter
                </button>
            </div>
        </div>
    );
}*/
