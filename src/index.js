import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import Sidebar from "./component/Sidebar";
import Main from "./component/Main";

const client = new ApolloClient({
        uri: `${window.location.protocol}//${window.location.hostname}:5050/gql`,
        cache: new InMemoryCache(),
    }
);

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <div className="App">
                <Sidebar/>
                <Main/>
            </div>
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root')
);