const {ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const {bodyParserGraphQL} = require('body-parser-graphql');
const compression = require('compression');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type Todo {
    id : ID!
    text: String!
    isCompleted: Boolean!
  }
 
  
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. 
  type Query {
    todos: [Todo]
  }
  
  type Mutation {
    addTodo(text: String!) : Todo
    updateTodo(id: ID!, text: String!, isCompleted: Boolean!) : Todo
    deleteTodo(id: ID!) : Todo
  }
  
`;

const id = () => {
    return Math.random().toString(36).substring(10);
};


let todos = [
    {
        id: id(),
        text: 'Todo Sample 1',
        isCompleted: false,
    },
    {
        id: id(),
        text: 'Todo Sample 2',
        isCompleted: false,
    },
];

const resolvers = {
    Query: {
        todos: () => todos,
    },
    Mutation: {
        addTodo: (_, {text}) => {
            const todo = {
                id: id(),
                text: text,
                isCompleted: false,
            };
            todos.push(todo);
            return todo;
        },
        updateTodo: (_, args) => {
            const todo = {
                id : args.id,
                text : args.text,
                isCompleted: args.isCompleted,
            };
            todos = todos.map(t => t.id === args.id ? todo : t);
            return todo;
        },
        deleteTodo: (_, {id}) => {
            todos = todos.filter((t) => t.id !== id);
        }
    }
};



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
    console.log(`🚀 Server ready at http://localhost:${port} / ${server.graphqlPath}`);
});

