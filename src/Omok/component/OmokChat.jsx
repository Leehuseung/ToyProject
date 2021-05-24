import {useState, useEffect} from "react";
import {chatSocket} from "../js/socket"
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    chatArea: {
        backgroundColor: "skyblue",
        maxHeight: 600,
        marginTop: 30,
    },
    chatTextSpan: {
        padding: 10,
        whiteSpace: "pre-line",
    }
}));

export default function OmokChat(props) {
    const classes = useStyles();
    let [inputText, setInputText] = useState('');
    let [textdiv, setTextDiv] = useState('');

    useEffect(() => {
        chatSocket.emit('init', {name: `${props.user.name} entered the chat room`});

        chatSocket.on('announce', (msg) => {
            setTextDiv(prevState => prevState + `[ ${msg} ]` + '\n');
        });

        chatSocket.on('res', (data) => {
            setTextDiv(prevState => prevState + `${data.name} : ` + data.message + '\n');
            setInputText('');
        });

        return () => {
            chatSocket.emit('leave', {name: `${props.user.name} leaved the chat room`})
            chatSocket.removeAllListeners();
        }
    }, [props.user.name]);

    const sendMessage = () => {
        if (inputText.length > 0) {
            chatSocket.emit('chat', {
                name: props.user.name,
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
        <div className={classes.chatArea}>
            <h2>채팅영역</h2>
            <div className={classes.chatTextSpan}>
                <span>{textdiv}</span>
            </div>
            <textarea className='chatTextArea'
                      value={inputText}
                      onChange={onChange}
                      onKeyPress={handleKeyPress}
            />
            <button onClick={sendMessage}>enter</button>
        </div>
    );
}