import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {Todos} from './App_apollo'

const client = new ApolloClient({uri: `http://localhost:5050/gql`, cache: new InMemoryCache()});

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            {/*<App/>*/}
            <Todos/>
        </React.StrictMode>,
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();