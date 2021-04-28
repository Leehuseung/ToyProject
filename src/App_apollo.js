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
            const queryData = cache.readQuery({query: FETCH_TODOS});
            const newData = {todos: [...queryData.todos, addTodo]};
            cache.writeQuery({query: FETCH_TODOS, data: newData});
        },
        onError: (error) => console.log('UpdateError: ', error.message),
    });
    const [updateTodo] = useMutation(UPDATE_TODO, {
        update: (cache, {data: {updateTodo}}) => {
            const queryData = cache.readQuery({query: FETCH_TODOS});
            const newData = {todos: queryData.todos.map(t => t.id === updateTodo.id ? updateTodo : t)};
            cache.writeQuery({query: FETCH_TODOS, data: newData});
        },
    });
    const [deleteTodo] = useMutation(DELETE_TODO, {
        onError: (error) => {
            console.log('Delete Error: ', error);
        }
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
                        removeTodo={() => deleteTodo({
                                variables: {id: todo.id},
                                update: (cache) => {
                                    const queryData = cache.readQuery({query: FETCH_TODOS});
                                    const newData = {todos: queryData.todos.filter(t => t.id !== todo.id)};
                                    cache.writeQuery({query: FETCH_TODOS, data: newData});
                                },
                            }
                        )}
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