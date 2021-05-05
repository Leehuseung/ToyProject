import React, {useState} from "react";
import {Menu, MenuItem} from "@material-ui/core";

export function Todo({todo, updateTodo, removeTodo}) {
    return (
        <div
            className="todo"
            style={{textDecoration: todo.isCompleted ? "line-through" : ""}}
        >
            {todo.text}, {todo.id}
            <div>
                <StateButton onStateChanged={(state)=>updateTodo(state)}/>
                <button onClick={() => removeTodo()}>x</button>
            </div>
        </div>
    );
}

function StateButton({onStateChanged}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value) => {
        setAnchorEl(null);
    };

    const onSelect = (value) => {
        onStateChanged(value);
        handleClose();
    }

    return (
        <div>
            <button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                Chane State
            </button>
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
