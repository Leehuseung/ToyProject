import TodoList from './TodoList';
import {useMutation} from "@apollo/client";
import {ADD_TODO} from "../js/graphql/graphql";

export default function TodoWrap(props) {

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
        <div id="todoWrap">
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
            <TodoList status="Pending"/>
            <TodoList status="Proceeding"/>
            <TodoList status="Completed"/>
        </div>
    );
}