import React, {useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {TablePagination} from "@material-ui/core";
import {useHistory} from 'react-router-dom';
import {useModal} from "../../common/hooks";
import sweetAlert from 'sweetalert';

export default function RoomListview(props) {
    const history = useHistory();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRoomClick = (room) => {
        if (room.isAvailable) {
            if(room.hasPassword) {
                alert('TODO: Implement password input');
            } else {
                history.push(`/omok/${room.id}`);
            }
        } else {
            sweetAlert('This Room is Not Available','','warning');
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
                        {props.rooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((room, index) =>
                            (
                                <TableRow key={room.id} onClick={() => handleRoomClick(room)}>
                                    <TableCell>{page * rowsPerPage + index}</TableCell>
                                    <TableCell>{(room.isAvailable)?'Waiting':'Playing'}</TableCell>
                                    <TableCell align="left">{room.title}</TableCell>
                                    <TableCell align="right">{(room.isAvailable)?'1/2':'2/2'}</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 50]}
                component="div"
                count={props.rooms.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
