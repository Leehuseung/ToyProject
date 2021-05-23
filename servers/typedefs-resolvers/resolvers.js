const {pool} = require('../database');

const todos = {
    get: async () => {
        let [result] = await pool.query('SELECT * FROM TODO');
        return result;
    },
    delete: async (id) => {
        await pool.query('DELETE FROM TODO WHERE ID = ?', [id]);
    },
    add: async (todo) => {
        let [resultSetHeader, undefined] = await pool.query('INSERT INTO TODO (TEXT,ISCOMPLETED) VALUES(?,?)', [todo.text, todo.isCompleted]);
        return resultSetHeader.insertId;
    },
    update: async (todo) => {
        await pool.query('UPDATE TODO SET ISCOMPLETED = ?,TEXT = ? WHERE ID = ?', [todo.isCompleted, todo.text, todo.id]);
    }
}


const resolvers = {
    Query: {
        todos: async () => todos.get(),
    },
    Mutation: {
        addTodo: async (_, args) => {
            const todo = {
                text: args.text,
                isCompleted: args.isCompleted,
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
            await todos.update(todo);
            return todo;
        },
        deleteTodo: async (_, {id}) => {
            await todos.delete(id);
            return {id: id};
        }
    }
};

module.exports = {
    resolvers: resolvers,
}