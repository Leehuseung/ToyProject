const {gql} = require('apollo-server-express');

const typeDefs = gql`
  type Todo {
    id : ID!
    text: String!
    isCompleted: Boolean
  }
  
  type Query {
        todos: [Todo]
  }
  
  type Mutation {
    addTodo( text: String!, isCompleted: Boolean) : Todo
    updateTodo(id: ID!, text: String!, isCompleted: Boolean) : Todo
    deleteTodo(id: ID!) : Todo
  }
`;

module.exports = {
    typeDefs : typeDefs
}