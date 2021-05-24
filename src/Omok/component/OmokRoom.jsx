import { makeStyles } from '@material-ui/core/styles';
import OmokChat from "./OmokChat";
import {useGameRoom} from "../js/hooks";

const useStyles = makeStyles({
    room: {
        minWidth: 275,
        width: '95%',
        marginBottom: 20,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

export default function OmokRoom(props) {
    const classes = useStyles();

    const room = useGameRoom(props.id);
    if(room===null) {
        return <>Loading...</>
    }

    return (
        <>
            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', margin: '30px'}}
            >
                <div className={classes.room}>
                   <h2>오목판</h2>
                </div>
                <OmokChat
                    title={room.title}
                    room={props.id}
                />
            </div>
        </>
    );
}