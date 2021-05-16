import {Todo} from "./Todo";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {useQuery} from "@apollo/client";
import {FETCH_TODOS} from "../js/graphql/graphql";
import {useDrop} from "react-dnd";
import {useDialog, useTodo, useUpdate} from "../js/hooks/custom_hooks";



export default function TodoLayout(props) {

    let accepts = [];

    if(props.type == 'Pending'){
        accepts.push('Proceeding');
        accepts.push('Completed');
    }else if (props.type == 'Proceeding'){
        accepts.push('Pending');
        accepts.push('Completed');
    } else {
        accepts.push('Pending');
        accepts.push('Proceeding');
    }

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: accepts,
        drop: () => ({ name: props.type }),
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    const {loading, error, data} = useQuery(FETCH_TODOS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    let grouped = groupByStatus(data.todos);
    let keys = Array.from(grouped.keys());


    return (
        <div className="todo-list"
             id={props.key}
             ref={drop}
             style={{ backgroundColor: isOver ? '#3f51b5' : '' }}
        >
            {
                grouped.get(props.type).map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                    />
                ))
            }
        </div>
    );
}

function groupByStatus(todos) {
    let result = new Map();
    result.set("Pending", []);
    result.set("Proceeding", []);
    result.set("Completed", []);

    todos.forEach((todo) => {
        let status = todo.isCompleted;
        if (status === undefined || status === null) {
            result.get("Pending").push(todo);
        } else if (status) {
            result.get("Completed").push(todo);
        } else {
            result.get("Proceeding").push(todo);
        }
    });
    return result;
}