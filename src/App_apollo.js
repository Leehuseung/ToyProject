import './App.css';
import React from "react";
import {useMutation, useQuery, useApolloClient} from "@apollo/client";
import {ADD_TODO, DELETE_TODO, FETCH_TODOS, UPDATE_TODO} from './graphql';
import {onError} from "@apollo/client/link/error";

function Todo({todo, toggleTodo, removeTodo}) {
    return (
        <div
            className="todo"
            key={todo.id}
            style={{textDecoration: todo.isCompleted ? "line-through" : ""}}
        >
            {todo.text}, {todo.id}
            <div>
                <button onClick={() => toggleTodo()}>Complete</button>
                <button onClick={() => removeTodo()}>x</button>
            </div>
        </div>
    );
}

export function Todos() {
    const {loading, error, data} = useQuery(FETCH_TODOS);
    const [addTodo] = useMutation(ADD_TODO, {
        update: (cache, {data: {addTodo}}) => {
            cache.modify({
                fields: {
                    todos(existing) {
                        return [...existing, addTodo];
                    }
                },
            });
        },
    });
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


    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    let input;

    return (
        <div className="app">
            <div className="todo-list">
                {data.todos.map(todo => (
                    <Todo
                        todo={todo}
                        toggleTodo={() => updateTodo({
                            variables: {
                                id: todo.id,
                                text: todo.text,
                                isCompleted: !todo.isCompleted
                            }
                        })}
                        removeTodo={() => deleteTodo({variables: {id: todo.id}})}
                    />
                ))}
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        addTodo({variables: {text: input.value}});
                        input.value = '';
                    }}
                >
                    <input
                        ref={node => {
                            input = node;
                        }}
                    />
                    <button type="submit">Add Todo</button>
                </form>
            </div>
        </div>
    );

}