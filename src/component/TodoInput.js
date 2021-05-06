import {useMutation} from "@apollo/client";
import {ADD_TODO} from "../js/graphql/graphql";
import React from "react";

export default function TodoInput() {
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

    let input;

    return (
        <div id="todoInput">
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
    );
}