const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const {bodyParserGraphQL} = require('body-parser-graphql');
const compression = require('compression');
const {resolvers} = require("./typedefs-resolvers/resolvers");
const {typeDefs} = require("./typedefs-resolvers/typedefs");
const webSocket = require('./socket');
const dotenv = require('dotenv');

dotenv.config()

if(process.env.USE_APOLLO_SERVER === 'true') {
    const port = 5050;
    const app = express();

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
        console.log(`🚀 Apollo server is ready at http://localhost:${port} / ${server.graphqlPath}`);
    });
}


webSocket();

