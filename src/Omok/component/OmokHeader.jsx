import {Room} from "../js/models";
import {makeStyles, Menu, MenuItem} from "@material-ui/core";
import {useModal} from "../../common/hooks";
import Button from "@material-ui/core/Button";
import React, {useContext, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {fade} from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import {useUpdateRoom} from "../js/hooks/useMutations";
import {useHistory} from "react-router-dom";
import {UserContext} from "./pages/OmokHome";
import {RoomListContext} from "./RoomListProvider";

const useStyles = makeStyles((theme) => ({
    header: {
        display: "flex",
        flexDirection: "row-reverse",
        marginBottom: '10px',
    },
    search: {
        border: "3px solid black",
        flexGrow: 1,
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
    button: {
        marginLeft: theme.spacing(2),
    }
}));

export function OmokHeader() {
    const classes = useStyles();
    const {roomList, setRoomList, handleStatus, handleSearch} = useContext(RoomListContext);
    const [show, toggle] = useModal();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelect = (value) => {
        handleStatus(value);
        handleClose();
    }

    const handleClick = event => setAnchorEl(event.currentTarget);

    const handleSearchInputChange = (evt) => handleSearch(evt.target.value);

    return (
        <div className={classes.header}>
            <Button
                className={classes.button}
                variant="contained"
                color="inherit"
                onClick={toggle}
            >
                NEW
            </Button>
            <MakeRoomDialog open={show} toggle={toggle}/>
            <Button
                className={classes.button}
                variant="contained"
                color="inherit"
                onClick={handleClick}
            >
                Filter
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={!!(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => onSelect(undefined)}>ALL</MenuItem>
                <MenuItem onClick={() => onSelect(false)}>Playing</MenuItem>
                <MenuItem onClick={() => onSelect(true)}>Waiting</MenuItem>
            </Menu>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                    fullWidth={true}
                    onChange={handleSearchInputChange}
                />
            </div>
        </div>
    );
}

function MakeRoomDialog(props) {
    const history = useHistory();

    const user = useContext(UserContext);
    const addRoom = useUpdateRoom();
    const [room, setRoom] = useState(Room(null, '', user.id, true, null));
    const handleTitleChange = (evt) => {
        setRoom(
            Room(
                null,
                evt.target.value,
                room.user,
                true,
                room.password,
            )
        )
    };

    const handlePasswordChange = (evt) => {
        setRoom(
            Room(
                null,
                room.title,
                room.user,
                true,
                evt.target.value,
            )
        )
    };


    return (
        <div>
            <Dialog
                open={props.open}
                onClose={() => props.toggle()}
                aria-labelledby="form-dialog-title"
                maxWidth="xl"
            >
                <DialogTitle id="form-dialog-title">New Room</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <p>Title</p>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                fullWidth
                                onChange={handleTitleChange}
                            />
                        </Grid>
                    </Grid>
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
                            addRoom({
                                title: room.title,
                                password: room.password,
                                user: {id: user.id, name: user.name ?? ''},
                            }).then(res => {
                                if (res.data) {
                                    props.toggle();
                                    history.push(`/omok/${res.data.createRoom.id}`);
                                } else {
                                    alert('Error on creating room');
                                }
                            });
                        }}
                        color="primary"
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}


