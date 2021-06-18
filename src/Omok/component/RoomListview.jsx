import React, {useContext, useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {TablePagination} from "@material-ui/core";
import sweetAlert from "sweetalert";
import {useHistory} from "react-router-dom";
import {useModal} from "../../common/hooks";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {RoomListContext} from "./RoomListProvider";
import {Lock} from "@material-ui/icons";


const CurrentRoom = React.createContext(null);

export default function RoomListview(props) {
    const [page, setPage] = useState(0);
    const [currentRoom, setRoom] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const history = useHistory();
    const [show, toggle] = useModal();
    const {roomList} = useContext(RoomListContext);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleRoomClick = (room) => {
        if (room.isAvailable) {
            if (room.hasPassword) {
                setRoom(room);
                toggle();
            } else {
                history.push(`/omok/${room.id}`);
            }
        } else {
            return sweetAlert('This Room is Not Available', '', 'warning');
        }
    }

    useEffect(() => {
        setPage(0)
    }, [roomList])

    return (
        <Paper>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="right">Players</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roomList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((room, index) =>
                            (
                                <TableRow key={room.id} onClick={() => handleRoomClick(room)}>
                                    <TableCell>{page * rowsPerPage + index}</TableCell>
                                    <TableCell>{(room.isAvailable) ? 'Waiting' : 'Playing'}</TableCell>
                                    <TableCell align="left">
                                        <RoomTitle room={room}/>
                                    </TableCell>
                                    <TableCell align="right">{(room.isAvailable) ? '1/2' : '2/2'}</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={roomList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <CurrentRoom.Provider value={currentRoom}>
                <PasswordDialog
                    open={show}
                    toggle={toggle}
                />
            </CurrentRoom.Provider>
        </Paper>
    );
}


function PasswordDialog(props) {
    const history = useHistory();
    const room = useContext(CurrentRoom);
    const [password, setPassword] = useState(null);
    const handlePasswordChange = (evt) => setPassword(evt.target.value);

    return (
        <Dialog
            open={props.open}
            onClose={() => props.toggle()}
            aria-labelledby="form-dialog-title"
            maxWidth="xl"
        >
            <DialogTitle id="form-dialog-title">Enter Password</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <p>Password</p>
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            margin="dense"
                            id="pwd"
                            fullWidth
                            inputProps={{
                                maxLength: 4,
                            }}
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.toggle()} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        props.toggle();
                        history.push(`/omok/${room.id}?pwd=${password}`);
                    }}
                    color="primary"
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const RoomTitle = (props) => {
    if (props.room.hasPassword)
        return (
            <div>
                <span style={{display: "inline-flex", alignItems: "center"}}>
                    {props.room.title}
                    <Lock/>
                </span>
            </div>
        );
    else
        return (
            <div>
                {props.room.title}
            </div>
        );
}