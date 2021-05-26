import Grid from '@material-ui/core/Grid';
import {NewTodoButton} from "./TodoEdit.jsx";
import TodoList from './TodoList.jsx';
import {stateType} from "../js/stateType";
import {useFetch} from "../js/hooks";
import {makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {appBarHeight} from "../../common/components/constants";

const useStyles = makeStyles((theme)=>({
    root: {
        marginLeft : '30px',
        marginRight : '30px',
        marginTop : '20px',
        overflow: 'auto',
    },
    container : {
        width : '100%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: "linen",
        flexGrow: 1,
        whiteSpace: "pre-line",
        overflow : 'scroll',
        maxHeight : `calc(100vh - ${appBarHeight}px - 100px)`
    },
    title: {
        flexGrow: 1,
        textAlign : 'center',
        margin : '20px',
    },
}));

export default function TodoLayout() {
    const classes = useStyles();
    const {loading, error, data} = useFetch();
    if (loading) return 'Loading...';
    if (error) return (
        <div id="todoLayout">
            `Error! {error.message}`;
        </div>
    );

    let grouped = groupByStatus(data.todos);

    return (
        <div className={classes.root}>
            <NewTodoButton/>
            <Grid container spacing={3}>
                {
                    stateType.keys.map((key, index) => (
                        <Grid
                            key={key}
                            item xs={12 / stateType.keys.length}>
                            <div className={classes.container}>
                                <Typography variant="h5" className={classes.title}>
                                    {key}
                                </Typography>
                                <TodoList key={key}
                                          type={key}
                                          accepts={stateType.keys.filter((value) => value !== key)}
                                          todos={grouped.get(key)}
                                />
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
    result.set(stateType.PROCEEDING, []);
    result.set(stateType.PENDING, []);
    result.set(stateType.COMPLETED, []);
    todos.forEach((todo) => {
        let type = stateType.getType(todo.isCompleted);
        let items = result.get(type);
        if (items) {
            items.push(todo);
        } else {
            result.set(type, [todo]);
        }
    });
    return result;
}