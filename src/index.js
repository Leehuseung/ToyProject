import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import {AuthProvider} from "./common/AuthProvider";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const client = new ApolloClient({
        //uri: `${window.location.protocol}//${window.location.hostname}:8000/graphql/`,
        uri: `${window.location.protocol}//49.247.146.76:8000/graphql/`,
        cache: new InMemoryCache(),
    }
);

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
