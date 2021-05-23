import Grid from '@material-ui/core/Grid';
import {NewTodoButton} from "./TodoEdit.jsx";
import TodoList from './TodoList.jsx';
import {stateType} from "../js/stateType";
import {useFetch} from "../js/hooks";

export default function TodoLayout() {
    const {loading, error, data} = useFetch();
    if (loading) return 'Loading...';
    if (error) return (
        <div id="todoLayout">
            `Error! {error.message}`;
        </div>
    );

    let grouped = groupByStatus(data.todos);

    return (
        <div id="todoLayout">
            <NewTodoButton/>
            <Grid container spacing={3}>
                {
                    stateType.keys.map(key => (
                        <Grid
                            key={key}
                            item xs={12 / stateType.keys.length}>
                            <h1 style={{textAlign: "center"}}>{key}</h1>
                            <TodoList key={key}
                                      type={key}
                                      accepts={stateType.keys.filter((value) => value !== key)}
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