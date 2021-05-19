import {Todo} from "./Todo.jsx";
import React from "react";
import {useDrop} from "react-dnd";
import {stateType} from "./stateType";

export default function TodoList(props) {

    let accepts = [];

    switch (props.type){
        case stateType.PENDING :
            accepts = [stateType.PROCEEDING,stateType.COMPLETED];
            break;
        case stateType.PROCEEDING :
            accepts = [stateType.PENDING,stateType.COMPLETED];
            break;
        case stateType.COMPLETED :
            accepts = [stateType.PENDING,stateType.PROCEEDING];
            break;
    }

    function checkStatus(type){
        switch (props.type){
            case stateType.PENDING : return null;
            case stateType.PROCEEDING : return false;
            case stateType.COMPLETED : return true;
        }
    }

    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        // The type (or types) to accept - strings or symbols
        accept: accepts,
        drop: () => ({ name: checkStatus(props.type) }),
        // Props to collect
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    return (
        <div className="todo-list"
             id={props.key}
             ref={drop}
             style={{ backgroundColor: isOver ? '#3f51b5' : '' }}
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