import {useMutation, useQuery} from "@apollo/client";
import {ADD_TODO, DELETE_TODO, FETCH_TODOS, UPDATE_TODO} from "./graphql";
import {useState} from "react";

export function useFetch() {
    const {loading, error, data} = useQuery(FETCH_TODOS);
    return {loading, error, data};
}

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


export function useModal () {
    const [showModal, updateShowModal] = useState(false);
    const toggleModal = () => updateShowModal(state=>!state);

    return [showModal, toggleModal];
}