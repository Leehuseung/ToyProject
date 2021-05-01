import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {Todos} from './App_apollo'

const client = new ApolloClient({
        uri: `${location.protocol}//${location.hostname}:5050/gql`,
        cache: new InMemoryCache(),
    }
);

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            {/*<App/>*/}
            <Todos/>
        </React.StrictMode>,
    </ApolloProvider>,
    document.getElementById('root')
);