const {gql} = require('apollo-server-express');
const {pool} = require('../database');

const typeDefs = gql`
  type Todo {
    id : ID!
    text: String!
    isCompleted: Boolean
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

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}