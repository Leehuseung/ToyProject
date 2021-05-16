import React from "react";
import Paper from '@material-ui/core/Paper';
import {EditTodoDialog} from "./TodoEdit";
import {useDelete, useDialog, useTodo, useUpdate} from "../js/hooks/custom_hooks";
import { makeStyles } from "@material-ui/core/styles";
import ClearIcon from '@material-ui/icons/Clear';
import { useDrag } from 'react-dnd';
import {useState} from "react";


export function Todo({todo}) {
    const [show, toggle] = useDialog();
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

    let type = '';

    if(todo.isCompleted == null || typeof todo.isCompleted == 'undefined'){
        type = 'Pending';
    }else if(!todo.isCompleted){
        type = 'Proceeding';
    } else {
        type = 'Completed';
    }

    const [{ isDragging }, drag] = useDrag(() => ({
        type: type,
        item: { todo },
        end: (item, monitor) => {

            const dropResult = monitor.getDropResult();

            if (item && dropResult) {
                let flag = null;

                if(dropResult.name == 'Proceeding'){
                    flag = false;
                } else if (dropResult.name == 'Completed'){
                    flag = true;
                }

                updateTodo({
                    id: todo.id,
                    text: todo.text,
                    isCompleted: flag,
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
            role="todo"
        >
            <Paper className={customPaperStyles().todo} onClick={toggle}>
                {todo.text}, {todo.id}
                <ClearIcon className={customPaperStyles().removeBtn} onClick={(e)=>{
                    e.stopPropagation();
                    removeTodo(todo.id);
                }}/>
                {/*<button  className={customPaperStyles().removeBtn} onClick={()=>removeTodo(todo.id)}>x</button>*/}
            </Paper>
            <EditTodoDialog open={show} toggle = {toggle} todo={todo}/>
        </div>
    );
}
