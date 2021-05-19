import {useMutation} from "@apollo/client";
import {ADD_TODO, DELETE_TODO, UPDATE_TODO} from "../graphql/graphql";
import React, {useState} from "react";

export function useUpdate() {
    const updateTodo = (todo) => {
        if(todo.id) {
            update({variables: todo});
        } else {
            add({variables: todo});
        }
    }

    const [add] = useMutation(ADD_TODO, {
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

    const [update] = useMutation(UPDATE_TODO, {
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
    return updateTodo;
}

export function useDelete() {
    const remove = (id) => deleteTodo({variables: {id:id}});

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
    return remove;
}


export function useTodo(initialTodo) {
    ///use cached todo object
    const [state, setState] = useState(initialTodo);

    function modifyTodo(todo) {
        setState(todo);
    }

    return [state, modifyTodo];
}

export function useDialog () {
    const [showModal, updateShowModal] = useState(false);
    const toggleModal = () => updateShowModal(state=>!state);

    return [showModal, toggleModal];
}