const {ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const {bodyParserGraphQL} = require('body-parser-graphql');
const compression = require('compression');
const queries = require('./typedefs-resolvers/_queries');
const mutaions = require('./typedefs-resolvers/_mutations');
const todo = require('./typedefs-resolvers/todo.js');

const port = 5050;
const app = express();


const typeDefs = [
    queries,
    mutaions,
    todo.typeDefs
];

const resolvers = [
    todo.resolvers
];

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
});

server.applyMiddleware({app, path: "/gql"});

app.use(cors({
    //app origin
    origin: ['http://localhost:3000'],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.use(bodyParserGraphQL());
app.use(compression);

app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port} / ${server.graphqlPath}`);
});
