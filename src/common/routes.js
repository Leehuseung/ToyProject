import {Home, ListAlt, SportsEsports} from "@material-ui/icons";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import TodoLayout from "../TodoList/component/TodoLayout";
import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {OmokHome} from "../Omok/component/pages/OmokHome";

const client = new ApolloClient({
        //uri: `${window.location.protocol}//${window.location.hostname}:8000/graphql/`,
        uri: `${window.location.protocol}//49.247.146.76:8000/graphql/`,
        cache: new InMemoryCache(),
    }
);

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
            <ApolloProvider client={client}>
                <DndProvider backend={HTML5Backend}>
                    <TodoLayout/>
                </DndProvider>
            </ApolloProvider>
        )
    },
    {
        path: "/omok",
        text: "오목",
        icon: () => <SportsEsports/>,
        render: () => (
            <ApolloProvider client={client}>
                <OmokHome/>
            </ApolloProvider>
        )
    },
];
