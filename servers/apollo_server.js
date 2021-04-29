const {ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const {bodyParserGraphQL} = require('body-parser-graphql');
const compression = require('compression');
const config = require('../config.json');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
});

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


let todos = {
    get: async () => {
        let [result] = await pool.query('SELECT * FROM TODO');
        return result;
    },
    delete: async (id) => {
        await pool.query('DELETE FROM TODO WHERE ID = ?', [id]);
    },
    add: async (todo) => {
        let [resultSetHeader,undefined] = await pool.query('INSERT INTO TODO (TEXT,ISCOMPLETED) VALUES(?,?)', [todo.text, todo.isCompleted]);
        return resultSetHeader.insertId;
    },
    update: async (todo) => {
        await pool.query('UPDATE TODO SET ISCOMPLETED = ? WHERE ID = ?', [todo.isCompleted, todo.id]);
    }
}


const resolvers = {
    Query: {
        todos: async () => todos.get(),
    },
    Mutation: {
        addTodo: async (_, {text}) => {
            const todo = {
                text: text,
                isCompleted: false,
            };
            todo.id = await todos.add(todo);
            return todo;
        },
        updateTodo: async (_, args) => {
            const todo = {
                id: args.id,
                text: args.text,
                isCompleted: args.isCompleted,
            };
            todos.update(todo);
            return todo;
        },
        deleteTodo: async (_, {id}) => {
            todos.delete(id);
            return {id : id};
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

