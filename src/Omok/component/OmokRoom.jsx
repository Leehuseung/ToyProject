import { makeStyles } from '@material-ui/core/styles';
import OmokChat from "./OmokChat";
import {useGameRoom} from "../js/hooks";
import {appBarHeight} from "../../common/components/constants";

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridGap: "30px",
        margin: '30px',
        overflow: 'auto',
    },
    rooms: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: '300px',
        minHeight: '300px',
        overflow: "auto",
        maxHeight : `calc(100vh - ${appBarHeight}px)`
    },
});

export default function OmokRoom(props) {
    const classes = useStyles();

    const room = useGameRoom(props.id);
    if(room===null) {
        return <>Loading...</>
    }

    return (
            <div className={classes.root}>
                <div className={classes.rooms}>
                   <h2>오목판</h2>
                </div>
                <OmokChat
                    title={room.title}
                    room={props.id}
                />
            </div>
    );
}