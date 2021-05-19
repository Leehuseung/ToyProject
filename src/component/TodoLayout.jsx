import Grid from '@material-ui/core/Grid';
import React from "react";
import {useQuery} from "@apollo/client";
import {FETCH_TODOS} from "../js/graphql/graphql";
import {NewTodoButton} from "./TodoEdit.jsx";
import TodoList from './TodoList.jsx';
import {stateType} from "./stateType";

export default function TodoLayout() {

    const {loading, error, data} = useQuery(FETCH_TODOS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    let grouped = groupByStatus(data.todos);
    let keys = Array.from(grouped.keys());

    return (
        <div id="todoLayout">
            <NewTodoButton/>
            <Grid container spacing={3}>
                {
                    keys.map(key => (
                        <Grid item xs={12 / keys.length}>
                            <h1 style={{textAlign: "center"}}>{key}</h1>
                            <TodoList type={key}
                                      todos={grouped.get(key)}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );
}

function groupByStatus(todos) {
    let result = new Map();
    result.set(stateType.PENDING, []);
    result.set(stateType.COMPLETED, []);
    result.set(stateType.PROCEEDING, []);

    todos.forEach((todo) => {
        let status = todo.isCompleted;
        if (status === undefined || status === null) {
            result.get(stateType.PENDING).push(todo);
        } else if (status) {
            result.get(stateType.COMPLETED).push(todo);
        } else {
            result.get(stateType.PROCEEDING).push(todo);
        }
    });
    return result;
}