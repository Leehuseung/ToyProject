import React from "react";
import Paper from '@material-ui/core/Paper';
import {EditTodoDialog} from "./TodoEdit";
import {useDelete, useDialog} from "../js/hooks/custom_hooks";

export function Todo({todo}) {
    const [show, toggle] = useDialog();
    const removeTodo = useDelete();

    return (
        <div
            className="todo"
            style={{textDecoration: todo.isCompleted ? "line-through" : ""}}
        >
            <Paper onClick={toggle}>
                {todo.text}, {todo.id}
                <div>
                    <button onClick={()=>removeTodo(todo.id)}>x</button>
                </div>
            </Paper>
            <EditTodoDialog open={show} toggle = {toggle} todo={todo}/>
        </div>
    );
}
