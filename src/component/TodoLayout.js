import Grid from '@material-ui/core/Grid';
import React from "react";
import {useQuery} from "@apollo/client";
import {FETCH_TODOS} from "../js/graphql/graphql";
import {NewTodoButton} from "./TodoEdit";
import {Todo} from "./Todo";
import {useDrop} from "react-dnd";
import TodoList from './TodoList';


export default function TodoLayout() {


    // const {loading, error, data} = useQuery(FETCH_TODOS);
    // if (loading) return 'Loading...';
    // if (error) return `Error! ${error.message}`;

    let grouped = groupByStatus();
    let keys = Array.from(grouped.keys());

    return (
        <div id="todoLayout">
            <NewTodoButton/>
            <Grid container spacing={3}>
                {
                    keys.map(key => (
                        <Grid item xs={12 / keys.length}>
                            <h1 style={{textAlign: "center"}}>{key}</h1>
                            <TodoList type={key}/>
                        </Grid>
                    ))
                }
            </Grid>
        </div>
    );
}

function groupByStatus() {
    let result = new Map();
    result.set("Pending", []);
    result.set("Proceeding", []);
    result.set("Completed", []);

    return result;
}