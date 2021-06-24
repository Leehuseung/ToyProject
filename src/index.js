import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {AuthProvider} from "./common/AuthProvider";
import {client} from "./common/ApolloClient";
import {ApolloProvider} from "@apollo/client";

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
