const { gql } = require('apollo-server-express')

const mutaions = gql`
    type Mutation {
        addTodo(text: String!) : Todo
        updateTodo(id: ID!, text: String!, isCompleted: Boolean!) : Todo
        deleteTodo(id: ID!) : Todo
    }
`

module.exports = mutaions