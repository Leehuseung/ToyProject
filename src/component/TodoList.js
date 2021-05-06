import {useMutation} from "@apollo/client";
import {DELETE_TODO, UPDATE_TODO} from "../js/graphql/graphql";
import {Todo} from "./Todo";

export default function TodoList(props) {

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
            switch (status) {
                case 'Pending' :
                    return t.isCompleted === null;
                case 'Proceeding' :
                    return t.isCompleted !== null && !t.isCompleted;
                case 'Completed' :
                    return t.isCompleted !== null && t.isCompleted;
            }
        }
    })(props.status);

    return (
        <>
            <h1>{props.status}</h1>
            <div className="todo-list">
                {
                    props.todos.filter((t) => checkStatus(t)).map(todo => (
                        <div>
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
                        </div>
                    ))}
            </div>
        </>
    );
}