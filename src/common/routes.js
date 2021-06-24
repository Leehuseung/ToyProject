import {Home, ListAlt, SportsEsports} from "@material-ui/icons";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import TodoLayout from "../TodoList/component/TodoLayout";
import React from "react";
import OmokMain from "../Omok/component/pages/OmokMain";
import {AuthContext} from "./AuthProvider";

export const routes = [
    {
        path: "/",
        exact: true,
        text: "Home",
        icon: () => <Home/>,
        render: () => (
            <AuthContext.Consumer>
                {
                    value =>
                    <h2> Welcome {value.user.name} </h2>
                }
            </AuthContext.Consumer>
        )
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
        icon: () => <SportsEsports/>,
        render: () => (
                <OmokMain/>
        )
    },
];
