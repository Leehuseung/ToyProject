import OmokRoom from "./OmokRoom";
import React,{useState} from "react";
import {useEffect} from "react";
import {Room, User} from "../js/models";
import {socket} from "../../App"

const getWrapperSize = () => {
    return (window.innerHeight - 64) + 'px'
}

const roomList = [
    Room(1, 'gogo', User(1, 'a')),
    Room(2, 'gogo2', User(2, 'a')),
    Room(3, 'gogo3', User(3, 'a')),
    Room(4, 'gogo4', User(4, 'a')),
    Room(5, 'gogo5', User(5, 'a')),
];

export default function OmokMain() {

    const refreshHeight = () => {
        setHeight(getWrapperSize());
    }

    let [height, setHeight] = useState(getWrapperSize());

    useEffect(() => {
        window.addEventListener('resize', refreshHeight);
        return () => { // cleanup
            window.removeEventListener('resize', refreshHeight);
        }
    }, []);

    /* socket */


    let [inputText, setInputText] = useState('');
    let [textdiv, setTextDiv] = useState('');
    useEffect(() => {
        socket.on('res', (msg) => {
            console.log('res : ' + msg);
            setTextDiv(prevState => [...prevState,'   |    '+msg]);
        });
    }, []);

    function clickfunc(){
        socket.emit('chat', { name: inputText });
    }

    const onChange = (e) => {
        setInputText(e.target.value);
    }

    return (
        <>
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr'}}
            >
                <div className='roomWrap' style={{maxHeight: height, overflowY: 'auto', marginLeft: '30px'}}>
                    {
                        roomList.map(room => (
                                <OmokRoom key={room.id}
                                          title={room.title}
                                          user={room.user}
                                />
                            )
                        )
                    }
                </div>
                <div style={{backgroundColor: "skyblue", maxHeight: '600px', marginTop: '30px'}}>
                    <h2>채팅영역</h2>
                    <textarea className='chatTextArea' value={inputText} onChange={onChange}/>
                    <button onClick={clickfunc}>enter</button>
                    <div className='chatting'>{textdiv}</div>
                </div>
            </div>
        </>
    );
}