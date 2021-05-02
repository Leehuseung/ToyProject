import './App.css';
import React from "react";
import {useMutation, useQuery } from "@apollo/client";
import {ADD_TODO, DELETE_TODO, FETCH_TODOS, UPDATE_TODO} from './graphql';
import {Todo} from './todo_component';


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
        <div className="App">
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
            <h1>Pending</h1>
            <div className="todo-list">
                {data.todos.filter(t => t.isCompleted === null).map(todo => (
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
            <h1>Proceeding</h1>
            <div className="todo-list">
                {data.todos.filter(t => (t.isCompleted !== null && !t.isCompleted)).map(todo => (
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
            <h1>Completed</h1>
            <div className="todo-list">
                {data.todos.filter(t => (t.isCompleted !== null && t.isCompleted)).map(todo => (
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
        </div>
    );

}