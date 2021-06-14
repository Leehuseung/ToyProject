import {makeStyles} from '@material-ui/core/styles';
import OmokChat from "../OmokChat";
import {useGameRoom} from "../../js/hooks";
import {appBarHeight} from "../../../common/components/constants";
import OmokBoard from "../OmokBoard.jsx";
import React from "react";
import {GameContext} from '../../js/game';
import {useHistory, useParams} from 'react-router-dom';
import sweetAlert from "sweetalert";

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
        minWidth: '500px',
        minHeight: '820px',
        overflow: "auto",
        maxHeight: `calc(100vh - ${appBarHeight}px)`
    },
    omokBoard: {
        backgroundColor: '#FFC078',
        width: '495px',
        height: '495px',
        border: '1px solid black',
        margin: '0 auto'
    },
    omokTop: {
        height: '100px'
    },
    boardRow: {
        height: '29px'
    }
});

export default function OmokRoom() {
    const history = useHistory();
    const classes = useStyles();
    const {id} = useParams();
    const {loading, error, room} = useGameRoom(id);
    const {boardArr} = React.useContext(GameContext);

    if (loading) return <>Loading...</>
    if (error) return <>Error...{error.toString()}</>

    if (room && room.isAvailable===1) {
        return (
            <div className={classes.root}>
                <OmokBoard id={id}/>
                <OmokChat
                    title={room.title}
                    room={id}
                />
            </div>
        );
    } else {
        sweetAlert('This Room is Not Available','','warning').then(() => history.goBack());
        return <>This room is currently not available!</>;
    }
}