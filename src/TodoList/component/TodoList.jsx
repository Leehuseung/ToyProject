import {Todo} from "./Todo.jsx";
import React from "react";
import {useDrop} from "react-dnd";
import {stateType} from "../js/stateType";


export default function TodoList(props) {
    const [{isOver}, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: props.accepts,
        drop: () => ({name: stateType.fromType(props.type)}),
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return (
        <div id={props.type}
             ref={drop}
             style={{
                 borderRadius: 10,
                 backgroundColor: isOver ? 'lightgrey' : '',
                 minHeight: '500px'
             }}
        >
            {
                props.todos.map(todo => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        state={todo.isCompleted}
                        type={props.type}
                    />
                ))
            }
        </div>
    );
}