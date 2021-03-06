import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Menu, MenuItem} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useUpdate} from "../js/hooks";
import {useModal} from "../../common/hooks";
import {stateType} from "../js/stateType";


export function NewTodoButton() {
    const [show, toggle] = useModal();

    return (
        <div style = {{marginBottom: '10px'}}>
            <Button variant="contained" color="secondary" onClick={toggle}>NewTODO</Button>
            <EditTodoDialog open={show} toggle ={toggle} todo={{id: null}}/>
        </div>
    );
}

export function EditTodoDialog(props) {
    const updateTodo = useUpdate();
    const [editingTodo, editTodo] = useState(props.todo);

    if (props.open) {
        return (
            <div>
                <Dialog
                    open={props.open}
                    onClose={()=>props.toggle()}
                    aria-labelledby="form-dialog-title"
                    maxWidth="xl"
                >
                    <DialogTitle id="form-dialog-title">Edit TODO</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <p>Description</p>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="description"
                                    fullWidth
                                    defaultValue={props.todo.text}
                                    onChange={event => editTodo({
                                        id: editingTodo.id,
                                        text: event.target.value,
                                        isCompleted: editingTodo.isCompleted,
                                    })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <p>State</p>
                            </Grid>
                            <Grid item xs={8}>
                                <TodoState
                                    onStateChanged={
                                        state => editTodo({
                                            id: editingTodo.id,
                                            text: editingTodo.text,
                                            isCompleted: state,
                                        })
                                    }
                                    todo={editingTodo}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>props.toggle()} color="primary">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                console.log(editingTodo);
                                updateTodo(editingTodo);
                                props.toggle();
                            }}
                            color="primary"
                        >
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    } else {
        return null;
    }

}


function TodoState(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSelect = (value) => {
        props.onStateChanged(value);
        handleClose();
    }

    return (
        <div>
            <Button variant="contained" color="primary" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                {stateType.getType(props.todo.isCompleted)}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => onSelect(undefined)}>Pending</MenuItem>
                <MenuItem onClick={() => onSelect(false)}>Proceeding</MenuItem>
                <MenuItem onClick={() => onSelect(true)}>Completed</MenuItem>
            </Menu>
        </div>
    );
}
