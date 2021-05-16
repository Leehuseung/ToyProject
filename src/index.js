import React from 'react';
import ReactDOM from 'react-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import Main from "./component/Main";
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

const client = new ApolloClient({
        uri: `${window.location.protocol}//${window.location.hostname}:5050/gql`,
        cache: new InMemoryCache(),
    }
);

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <DndProvider backend={HTML5Backend}>
                <div className="App">
                    <Main/>
                </div>
            </DndProvider>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root')
);