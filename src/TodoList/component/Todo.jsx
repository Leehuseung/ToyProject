import React from "react";
import Paper from '@material-ui/core/Paper';
import {EditTodoDialog} from "./TodoEdit.jsx";
import {useDelete, useModal, useUpdate} from "../js/hooks";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from '@material-ui/icons/Clear';
import { useDrag } from 'react-dnd';


export function Todo(props) {
    let todo = props.todo;

    const [show, toggle] = useModal();
    const removeTodo = useDelete();
    const updateTodo = useUpdate();

    const customPaperStyles = makeStyles({
        todo: {
            marginBottom : "10px",
            height: "45px",
            lineHeight: "45px",
            paddingLeft: "10px",
            cursor: "pointer"
        },
        removeBtn: {
            float : "right",
            marginTop: "11px",
            marginRight: "10px",
            marginBottom: "10px"
        }
    });

    const [{ isDragging }, drag] = useDrag(() => ({
        type: props.type,
        item: { todo },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (item && dropResult) {
                updateTodo({
                    id: todo.id,
                    text: todo.text,
                    isCompleted: dropResult.name,
                });
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }))

    return (
        <div
            className="todo"
            style={{textDecoration: todo.isCompleted ? "line-through" : "", opacity: isDragging ? 0.5 : 1}}
            id={todo.id}
            ref={drag}
        >
            <Paper className={customPaperStyles().todo} onClick={toggle}>
                {todo.text}, {todo.id}
                <ClearIcon className={customPaperStyles().removeBtn} onClick={(e)=>{
                    e.stopPropagation();
                    removeTodo(todo.id);
                }}/>
            </Paper>
            <EditTodoDialog open={show} toggle = {toggle} todo={todo}/>
        </div>
    );
}
