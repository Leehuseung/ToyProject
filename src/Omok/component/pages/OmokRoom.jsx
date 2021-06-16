import {makeStyles} from '@material-ui/core/styles';
import OmokChat from "../OmokChat";
import {appBarHeight} from "../../../common/components/constants";
import OmokBoard from "../OmokBoard.jsx";
import React from "react";
import {useHistory, useParams} from 'react-router-dom';
import sweetAlert from "sweetalert";
import useRoom from "../../js/hooks/useRoom";
import {useLocation} from "react-router-dom"

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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function OmokRoom() {
    const history = useHistory();
    const classes = useStyles();
    const {id} = useParams();
    const query = useQuery();

    const {loading, error, room} = useRoom(id, query.get('pwd'));

    if (loading) return <>Loading...</>
    if (error) {
        sweetAlert(`${error.toString()}`, '', 'warning').then(() => history.goBack());
        return <></>;
    }

    if (room && room.isAvailable === 1) {
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
        sweetAlert('This Room is Not Available', '', 'warning').then(() => history.goBack());
        return <>This room is currently not available!</>;
    }
}