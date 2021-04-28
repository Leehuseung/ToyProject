const {ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const {bodyParserGraphQL} = require('body-parser-graphql');
const compression = require('compression');
const config = require('../config.json');
const mysql = require('mysql2/promise');

mysql.pool = mysql.createPool({
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

const id = () => {
    return Math.random().toString(36).substring(10);
};

const pool = {
    query: async (query, value) => {
        try {
            var connection = await mysql.pool.getConnection(async conn => conn);
            let [result] = value
                ? await connection.query(query, value)
                : (await connection.query(query)) || null;
            connection.release();
            return result;
        } catch (err) {
            console.log(err);
            connection.rollback(() => {
            });
        }
    },
};


let todos = {
    get: () => {
        return pool.query('SELECT * FROM TODO');
    },
    delete: (id) => {
        pool.query('DELETE FROM TODO WHERE ID = ?', [id]);
    },
    add: (todo) => {
        pool.query('INSERT INTO TODO (ID,TEXT,ISCOMPLETED) VALUES(?,?,?)', [todo.id, todo.text, todo.isCompleted]);
    },
    update: (todo) => {
        pool.query('UPDATE TODO SET ISCOMPLETED = ? WHERE ID = ?', [todo.isCompleted, todo.id]);
    }
}


const resolvers = {
    Query: {
        todos: () => todos.get(),
    },
    Mutation: {
        addTodo: (_, {text}) => {
            const todo = {
                id: id(),
                text: text,
                isCompleted: false,
            };
            todos.add(todo);
            return todo;
        },
        updateTodo: (_, args) => {
            const todo = {
                id: args.id,
                text: args.text,
                isCompleted: args.isCompleted,
            };
            todos.update(todo);
            return todo;
        },
        deleteTodo: (_, {id}) => {
            todos.delete(id);
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

