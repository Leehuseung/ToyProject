import TodoList from './TodoList';
import Grid from '@material-ui/core/Grid';
import React from "react";
import TodoInput from "./TodoInput";
import {useQuery} from "@apollo/client";
import {FETCH_TODOS} from "../js/graphql/graphql";

export default function TodoLayout() {
    const {loading, error, data} = useQuery(FETCH_TODOS);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <div id="todoLayout">
            <TodoInput/>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <TodoList status="Pending" todos={data.todos}/>
                </Grid>
                <Grid item xs={4}>
                    <TodoList status="Proceeding" todos={data.todos}/>
                </Grid>
                <Grid item xs={4}>
                    <TodoList status="Completed" todos={data.todos}/>
                </Grid>
            </Grid>
        </div>
    );
}