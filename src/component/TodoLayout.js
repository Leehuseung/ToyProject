import Grid from '@material-ui/core/Grid';
import React from "react";
import {useQuery} from "@apollo/client";
import {FETCH_TODOS} from "../js/graphql/graphql";
import {NewTodoButton} from "./TodoEdit";
import {Todo} from "./Todo";


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
                            <h1>{key}</h1>
                            <div className="todo-list">
                                {
                                    grouped.get(key).map(todo => (
                                        <div>
                                            <Todo
                                                key={todo.id}
                                                todo={todo}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </Grid>
                    ))
                }
            </Grid>
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