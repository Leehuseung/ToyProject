import {Home, ListAlt, SportsEsports} from "@material-ui/icons";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import TodoLayout from "../TodoList/component/TodoLayout";
import OmokMain from "../Omok/component/OmokMain";
import React from "react";
import OmokRoom from "../Omok/component/OmokRoom";

export const routes = [
    {
        path: "/",
        exact: true,
        text: "Home",
        icon: () => <Home/>,
        render: () => <h2>Toy Project</h2>
    },
    {
        path: "/todolist",
        text: "Todo List",
        icon: () => <ListAlt/>,
        render: () => (
            <DndProvider backend={HTML5Backend}>
                <TodoLayout/>
            </DndProvider>
        )
    },
    {
        path: "/omok",
        text: "오목",
        exact: true,
        icon: () => <SportsEsports/>,
        render: () => (
            <OmokMain/>
        )
    },
    {
        path: "/omok/:id",
        render : (props) => (
            <OmokRoom
                id={props.match.params.id}
            />
        )
    }
];
