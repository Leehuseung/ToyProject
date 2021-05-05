import {useMutation, useQuery} from "@apollo/client";
import {DELETE_TODO, FETCH_TODOS, UPDATE_TODO} from "../js/graphql/graphql";
import {Todo} from "./Todo";

export default function TodoList(props) {

    const {loading, error, data} = useQuery(FETCH_TODOS);

    const [updateTodo] = useMutation(UPDATE_TODO, {
        update: (cache, {data: {updateTodo}}) => {
            cache.modify({
                fields: {
                    todos(existing, {readField}) {
                        return existing.map((t) => readField('id', t) === updateTodo.id ? updateTodo : t);
                    }
                },
            });
        },
    });
    const [deleteTodo] = useMutation(DELETE_TODO, {
        update: (cache, {data: {deleteTodo}}) => {
            cache.evict({fieldName: "notifications", broadcast: false});
            cache.modify({
                fields: {
                    todos(existing, {readField}) {
                        return existing.filter((t) => readField('id', t) !== deleteTodo.id);
                    }
                },
            });
        },
    });

    const checkStatus = ((status) => {
        return (t) => {
            switch (status){
                case 'Pending' : return t.isCompleted === null;
                case 'Proceeding' : return t.isCompleted !== null && !t.isCompleted;
                case 'Completed' :  return t.isCompleted !== null && t.isCompleted;
            }
        }
    })(props.status);


    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
        <>
            <h1>{props.status}</h1>
            <div className="todo-list">
                {
                    data.todos.filter((t) => checkStatus(t)).map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        updateTodo={(state) => updateTodo({
                            variables: {
                                id: todo.id,
                                text: todo.text,
                                isCompleted: state
                            }
                        })}
                        removeTodo={() => deleteTodo({variables: {id: todo.id}})}
                    />
                ))}
            </div>
        </>
    );
}